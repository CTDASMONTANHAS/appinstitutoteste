-- =====================================================================
-- 005 — Visitantes sem login não podem saber se a van está rodando.
-- As funções auxiliares passam a responder "falso" para quem não está logado.
-- =====================================================================

create or replace function public.rota_em_andamento(p_rota text) returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and exists (select 1 from rotas where id = p_rota and em_andamento)
$$;

create or replace function public.pode_operar_van() returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and coalesce(public.meu_papel() in ('transporte', 'coordenacao'), false)
$$;
