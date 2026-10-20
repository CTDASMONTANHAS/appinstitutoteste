-- =====================================================================
-- 004 — As duas rotas reais da van (ida e volta). Rodar depois do 002.
-- =====================================================================

insert into public.rotas (id, nome) values
  ('sede-grama', 'Sede (Campo 21) → Grama'),
  ('grama-sede', 'Grama → Sede (Campo 21)')
on conflict (id) do update set nome = excluded.nome, ativa = true;

-- Remove a rota de exemplo.
delete from public.van_posicao_atual where rota_id = 'norte';
delete from public.rotas where id = 'norte';
