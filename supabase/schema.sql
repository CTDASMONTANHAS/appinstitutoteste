-- =====================================================================
-- App do Instituto Cultural das Montanhas — esquema Supabase
-- Princípios: RLS em TODAS as tabelas, menor privilégio, dados mínimos
-- (LGPD, dados de menores), escrita sensível só via funções controladas.
-- Rodar no SQL Editor do Supabase (projeto novo).
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- Papéis ----------
create type papel_usuario as enum ('responsavel', 'professor', 'monitora', 'coordenacao');

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 120),
  telefone text check (char_length(telefone) <= 20),
  papel papel_usuario not null default 'responsavel',
  criado_em timestamptz not null default now()
);

-- Cria o perfil automaticamente no primeiro login (sempre como responsável).
create or replace function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();

-- Funções auxiliares (security definer, search_path fixo para evitar sequestro).
create or replace function public.meu_papel() returns papel_usuario
language sql stable security definer set search_path = public as $$
  select papel from public.perfis where id = auth.uid()
$$;
create or replace function public.eh_equipe() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.meu_papel() = 'coordenacao', false)
$$;

-- ---------- Projetos, turmas, calendário (públicos para leitura) ----------
create table public.projetos (
  id text primary key, nome text not null, area text not null check (area in ('cultura','esporte')),
  resumo text, ativo boolean not null default true
);
create table public.turmas (
  id text primary key,
  projeto_id text not null references public.projetos (id),
  nome text not null,
  dias smallint[] not null,          -- 0=dom … 6=sáb
  inicio time not null, fim time not null,
  local text, professor_id uuid references public.perfis (id),
  vagas smallint not null default 0 check (vagas >= 0),
  ativa boolean not null default true
);
create table public.calendario (
  id bigserial primary key,
  tipo text not null check (tipo in ('feriado','marco','recesso','reuniao','apresentacao')),
  titulo text not null, inicio date not null, fim date,
  hora time, local text, grupo text,
  publico boolean not null default true
);

-- ---------- Alunos e matrículas (dados pessoais — acesso restrito) ----------
create table public.alunos (
  id uuid primary key default gen_random_uuid(),
  responsavel_id uuid not null references public.perfis (id) on delete restrict,
  nome text not null check (char_length(nome) between 3 and 120),
  nascimento date not null check (nascimento > '1920-01-01' and nascimento < current_date),
  escola text check (char_length(escola) <= 120),
  serie text check (char_length(serie) <= 40),
  cad_unico boolean not null default false,       -- só sim/não; NIS não é coletado
  usa_van boolean not null default false,
  ponto_van text check (char_length(ponto_van) <= 60),
  autoriza_imagem boolean not null default false,
  aceite_lgpd_em timestamptz not null,
  criado_em timestamptz not null default now()
);
create index on public.alunos (responsavel_id);

create table public.matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  turma_id text not null references public.turmas (id),
  numero text unique,                              -- gerado pela coordenação ao ativar
  status text not null default 'pendente' check (status in ('pendente','ativa','cancelada')),
  criado_em timestamptz not null default now(),
  unique (aluno_id, turma_id)
);
create index on public.matriculas (turma_id);

create table public.frequencias (
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  turma_id text not null references public.turmas (id),
  data date not null,
  presente boolean not null,
  registrado_por uuid references public.perfis (id) default auth.uid(),
  primary key (aluno_id, turma_id, data)
);

create table public.avisos (
  id bigserial primary key,
  titulo text not null, texto text not null,
  turma_id text references public.turmas (id),    -- null = aviso geral
  criado_em timestamptz not null default now()
);

-- ---------- Van: só a posição ATUAL (sem histórico de trajetos) ----------
create table public.van_posicao_atual (
  rota_id text primary key,
  lat double precision not null check (lat between -20.4 and -19.8),   -- limita à região
  lng double precision not null check (lng between -41.4 and -40.8),
  em_rota boolean not null default false,
  atualizado_em timestamptz not null default now(),
  monitora_id uuid references public.perfis (id)
);

-- Verificações de vínculo (security definer: evitam recursão entre políticas).
create or replace function public.sou_responsavel(p_aluno uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from alunos where id = p_aluno and responsavel_id = auth.uid())
$$;
create or replace function public.sou_professor_da_turma(p_turma text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from turmas where id = p_turma and professor_id = auth.uid())
$$;
create or replace function public.sou_professor_do_aluno(p_aluno uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from matriculas m join turmas t on t.id = m.turma_id
                 where m.aluno_id = p_aluno and m.status = 'ativa' and t.professor_id = auth.uid())
$$;
create or replace function public.tenho_aluno_na_turma(p_turma text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from matriculas m join alunos a on a.id = m.aluno_id
                 where m.turma_id = p_turma and m.status = 'ativa' and a.responsavel_id = auth.uid())
$$;
create or replace function public.tenho_aluno_na_van() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from alunos a join matriculas m on m.aluno_id = a.id
                 where a.responsavel_id = auth.uid() and a.usa_van and m.status = 'ativa')
$$;

-- Aparelhos da van autorizados a enviar GPS. Guarda só o HASH do código do aparelho.
create table public.van_dispositivos (
  id uuid primary key default gen_random_uuid(),
  rota_id text not null,
  nome text not null,
  token_hash text not null unique,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Gera o código de um aparelho novo. Mostra o código UMA vez; no banco fica só o hash.
-- Rodar no SQL Editor:  select public.criar_dispositivo_van('norte', 'Celular da monitora');
create or replace function public.criar_dispositivo_van(p_rota text, p_nome text) returns text
language plpgsql security definer set search_path = public as $$
declare v_token text := encode(extensions.gen_random_bytes(24), 'hex');
begin
  insert into van_dispositivos (rota_id, nome, token_hash)
  values (p_rota, p_nome, encode(extensions.digest(v_token, 'sha256'), 'hex'));
  return v_token;
end $$;
revoke all on function public.criar_dispositivo_van(text, text) from public, anon, authenticated;

-- ---------- Ativar RLS em tudo ----------
alter table public.perfis enable row level security;
alter table public.projetos enable row level security;
alter table public.turmas enable row level security;
alter table public.calendario enable row level security;
alter table public.alunos enable row level security;
alter table public.matriculas enable row level security;
alter table public.frequencias enable row level security;
alter table public.avisos enable row level security;
alter table public.van_posicao_atual enable row level security;
alter table public.van_dispositivos enable row level security;  -- sem políticas: só a função do servidor acessa

-- Perfis: cada um vê e edita o próprio (sem poder trocar o papel); equipe vê todos.
create policy perfis_ler on public.perfis for select using (id = auth.uid() or public.eh_equipe());
create policy perfis_editar on public.perfis for update using (id = auth.uid())
  with check (id = auth.uid() and papel = public.meu_papel());
create policy perfis_equipe on public.perfis for update using (public.eh_equipe());

-- Conteúdo público: leitura aberta, escrita só da coordenação.
create policy projetos_ler on public.projetos for select using (true);
create policy projetos_equipe on public.projetos for all using (public.eh_equipe()) with check (public.eh_equipe());
create policy turmas_ler on public.turmas for select using (ativa or public.eh_equipe());
create policy turmas_equipe on public.turmas for all using (public.eh_equipe()) with check (public.eh_equipe());
create policy calendario_ler on public.calendario for select using (publico or auth.uid() is not null);
create policy calendario_equipe on public.calendario for all using (public.eh_equipe()) with check (public.eh_equipe());

-- Alunos: responsável vê os seus; professor vê os das suas turmas; equipe vê todos.
-- Inserção direta proibida (não há política de insert): só via solicitar_matricula().
create policy alunos_ler on public.alunos for select using (
  responsavel_id = auth.uid() or public.eh_equipe() or public.sou_professor_do_aluno(id));
create policy alunos_equipe on public.alunos for update using (public.eh_equipe()) with check (public.eh_equipe());

create policy matriculas_ler on public.matriculas for select using (
  public.sou_responsavel(aluno_id) or public.eh_equipe() or public.sou_professor_da_turma(turma_id));
create policy matriculas_equipe on public.matriculas for update using (public.eh_equipe()) with check (public.eh_equipe());

-- Frequência: responsável lê a dos seus; professor lança nas suas turmas.
create policy freq_ler on public.frequencias for select using (
  public.sou_responsavel(aluno_id) or public.eh_equipe() or public.sou_professor_da_turma(turma_id));
create policy freq_professor on public.frequencias for insert with check (
  public.eh_equipe() or public.sou_professor_da_turma(turma_id));

-- Avisos: gerais para logados; de turma só para quem tem aluno ativo nela.
create policy avisos_ler on public.avisos for select using (
  auth.uid() is not null and (turma_id is null or public.eh_equipe() or public.tenho_aluno_na_turma(turma_id)));
create policy avisos_equipe on public.avisos for all using (public.eh_equipe()) with check (public.eh_equipe());

-- Van: posição só para famílias com aluno ATIVO que usa a van (e equipe/monitora),
-- e só enquanto o aparelho está enviando (até 3 min sem sinal = fora de rota).
-- A gravação normal é feita pela função van-posicao (aparelho autenticado por código).
create policy van_ler on public.van_posicao_atual for select using (
  public.eh_equipe() or public.meu_papel() = 'monitora'
  or (em_rota and atualizado_em > now() - interval '3 minutes' and public.tenho_aluno_na_van()));
create policy van_monitora_ins on public.van_posicao_atual for insert
  with check (public.meu_papel() = 'monitora' and monitora_id = auth.uid());
create policy van_monitora_upd on public.van_posicao_atual for update
  using (public.meu_papel() = 'monitora') with check (public.meu_papel() = 'monitora' and monitora_id = auth.uid());

-- Obs.: as funções auxiliares retornam falso para visitantes (auth.uid() nulo),
-- por isso podem continuar executáveis por anon (turmas e calendário são públicos).

-- ---------- Função de matrícula (única porta de entrada de dados de alunos) ----------
create table public.limite_matriculas (usuario uuid, criado_em timestamptz default now());
alter table public.limite_matriculas enable row level security;  -- sem políticas: ninguém acessa direto

create or replace function public.solicitar_matricula(dados jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_aluno uuid; v_turma text := dados->>'turma_id'; v_protocolo text;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if coalesce((dados->>'aceite_lgpd')::boolean, false) is not true then raise exception 'aceite obrigatório'; end if;
  -- no máximo 5 solicitações por responsável a cada 24 h
  if (select count(*) from limite_matriculas where usuario = auth.uid() and criado_em > now() - interval '1 day') >= 5 then
    raise exception 'limite de solicitações';
  end if;
  if not exists (select 1 from turmas where id = v_turma and ativa) then raise exception 'turma inválida'; end if;

  update perfis set nome = left(dados->>'responsavel_nome', 120), telefone = left(dados->>'responsavel_telefone', 20)
    where id = auth.uid() and (nome is null or nome = '');

  insert into alunos (responsavel_id, nome, nascimento, escola, serie, cad_unico, usa_van, ponto_van, autoriza_imagem, aceite_lgpd_em)
  values (auth.uid(), left(dados->>'aluno_nome', 120), (dados->>'aluno_nascimento')::date,
          left(dados->>'escola', 120), left(dados->>'serie', 40), coalesce((dados->>'cad_unico')::boolean, false),
          coalesce((dados->>'usa_van')::boolean, false), left(dados->>'ponto_van', 60),
          coalesce((dados->>'autoriza_imagem')::boolean, false), now())
  returning id into v_aluno;

  insert into matriculas (aluno_id, turma_id) values (v_aluno, v_turma);  -- status = pendente
  insert into limite_matriculas (usuario) values (auth.uid());

  v_protocolo := 'MAT-' || upper(substr(replace(v_aluno::text, '-', ''), 1, 6));
  return v_protocolo;
end $$;
revoke all on function public.solicitar_matricula(jsonb) from public, anon;
grant execute on function public.solicitar_matricula(jsonb) to authenticated;

-- Realtime somente da posição da van (RLS continua valendo no Realtime).
alter publication supabase_realtime add table public.van_posicao_atual;
