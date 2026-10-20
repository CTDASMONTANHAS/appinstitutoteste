-- =====================================================================
-- 003 — Renomeia o papel "monitora" para "transporte" (em todo o banco).
-- Rodar no SQL Editor. Pode rodar antes ou depois do 002; se o 002 ainda
-- não foi rodado, rode este primeiro e o 002 em seguida.
-- =====================================================================

do $$
begin
  -- papel
  if exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
             where t.typname = 'papel_usuario' and e.enumlabel = 'monitora') then
    alter type public.papel_usuario rename value 'monitora' to 'transporte';
  end if;

  -- colunas
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'van_posicao_atual' and column_name = 'monitora_id') then
    alter table public.van_posicao_atual rename column monitora_id to transporte_id;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'rotas' and column_name = 'monitora_id') then
    alter table public.rotas rename column monitora_id to transporte_id;
  end if;

  -- nomes das políticas
  if exists (select 1 from pg_policies where tablename = 'van_posicao_atual' and policyname = 'van_monitora_ins') then
    alter policy van_monitora_ins on public.van_posicao_atual rename to van_transporte_ins;
  end if;
  if exists (select 1 from pg_policies where tablename = 'van_posicao_atual' and policyname = 'van_monitora_upd') then
    alter policy van_monitora_upd on public.van_posicao_atual rename to van_transporte_upd;
  end if;
end $$;

-- Políticas que comparavam o papel/coluna antigos (recriadas com os nomes novos).
drop policy if exists van_transporte_ins on public.van_posicao_atual;
create policy van_transporte_ins on public.van_posicao_atual for insert
  with check (public.meu_papel() = 'transporte' and transporte_id = auth.uid());
drop policy if exists van_transporte_upd on public.van_posicao_atual;
create policy van_transporte_upd on public.van_posicao_atual for update
  using (public.meu_papel() = 'transporte')
  with check (public.meu_papel() = 'transporte' and transporte_id = auth.uid());

-- Funções cujo texto citava 'monitora' (só existem se o 002 já foi rodado).
create or replace function public.pode_operar_van() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.meu_papel() in ('transporte', 'coordenacao'), false)
$$;

do $$
begin
  if to_regclass('public.rotas') is not null then
    execute $f$
      create or replace function public.iniciar_rota(p_rota text) returns void
      language plpgsql security definer set search_path = public as $b$
      begin
        if not public.pode_operar_van() then raise exception 'sem permissão'; end if;
        if not exists (select 1 from rotas where id = p_rota and ativa) then raise exception 'rota inválida'; end if;
        update rotas set em_andamento = false, iniciada_em = null where em_andamento and id <> p_rota;
        delete from van_posicao_atual where rota_id <> p_rota;
        update rotas set em_andamento = true, iniciada_em = now(), transporte_id = auth.uid() where id = p_rota;
      end $b$;
    $f$;
  end if;
end $$;
