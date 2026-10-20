-- =====================================================================
-- 002 — Rotas com início e fim controlados pela monitora (ou coordenação)
-- Rodar no SQL Editor DEPOIS do schema.sql e do seed.sql.
-- Regras:
--  * Só a monitora/coordenação inicia ou encerra rota (pelas funções abaixo).
--  * Encerrar apaga a posição da van: o mapa das famílias fica vazio na hora.
--  * Sem rota em andamento, o receptor de GPS ignora o que o celular enviar.
--  * Uma van por vez: iniciar uma rota encerra qualquer outra em andamento.
-- =====================================================================

create table if not exists public.rotas (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  nome text not null check (char_length(nome) <= 80),
  ativa boolean not null default true,
  em_andamento boolean not null default false,
  iniciada_em timestamptz,
  monitora_id uuid references public.perfis (id)
);

insert into public.rotas (id, nome) values ('norte', 'Rota Norte → Sede')
on conflict (id) do nothing;

alter table public.rotas enable row level security;

-- Logados veem as rotas; só a coordenação cadastra/edita. Início e fim só pelas funções.
create policy rotas_ler on public.rotas for select using (auth.uid() is not null);
create policy rotas_equipe on public.rotas for all using (public.eh_equipe()) with check (public.eh_equipe());

create or replace function public.rota_em_andamento(p_rota text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from rotas where id = p_rota and em_andamento)
$$;

create or replace function public.pode_operar_van() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.meu_papel() in ('monitora', 'coordenacao'), false)
$$;

create or replace function public.iniciar_rota(p_rota text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.pode_operar_van() then raise exception 'sem permissão'; end if;
  if not exists (select 1 from rotas where id = p_rota and ativa) then raise exception 'rota inválida'; end if;
  -- uma van por vez: encerra outras rotas e apaga posições antigas
  update rotas set em_andamento = false, iniciada_em = null where em_andamento and id <> p_rota;
  delete from van_posicao_atual where rota_id <> p_rota;
  update rotas set em_andamento = true, iniciada_em = now(), monitora_id = auth.uid() where id = p_rota;
end $$;

create or replace function public.encerrar_rota(p_rota text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.pode_operar_van() then raise exception 'sem permissão'; end if;
  update rotas set em_andamento = false, iniciada_em = null where id = p_rota;
  delete from van_posicao_atual where rota_id = p_rota;   -- some do mapa na hora, sem histórico
end $$;

revoke all on function public.iniciar_rota(text), public.encerrar_rota(text) from public, anon;
grant execute on function public.iniciar_rota(text), public.encerrar_rota(text) to authenticated;

-- Famílias só veem a van com a rota em andamento (além das regras anteriores).
drop policy if exists van_ler on public.van_posicao_atual;
create policy van_ler on public.van_posicao_atual for select using (
  public.eh_equipe() or public.meu_papel() = 'monitora'
  or (em_rota and public.rota_em_andamento(rota_id)
      and atualizado_em > now() - interval '3 minutes' and public.tenho_aluno_na_van())
);

-- A posição atual sem rota em andamento é apagada (limpeza do que já existir).
delete from public.van_posicao_atual v where not public.rota_em_andamento(v.rota_id);
