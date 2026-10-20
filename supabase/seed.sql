-- Dados iniciais (projetos, turmas e calendário). Rodar DEPOIS do schema.sql.
-- Horários das turmas são ilustrativos (exceto vôlei): ajuste antes de abrir matrículas.

insert into public.projetos (id, nome, area, resumo) values
  ('orquestra-jonice-tristao', 'Orquestra Jônice Tristão', 'cultura', 'Primeiro grupo de cordas friccionadas de Afonso Cláudio e região, com cerca de 60 alunos.'),
  ('orquestra-de-viola', 'Orquestra de Viola das Montanhas', 'cultura', 'Prática coletiva de viola caipira que celebra a música de raiz da região.'),
  ('musicalizacao-infantil', 'Musicalização Infantil', 'cultura', 'Primeiro contato das crianças com ritmo, escuta e música.'),
  ('musicalizacao-agricola', 'Musicalização Agrícola', 'cultura', 'Violão, sopros e percussão levados às comunidades rurais.'),
  ('corais-das-montanhas', 'Corais das Montanhas', 'cultura', 'Coral Infantil, Coro Jovem e Coral Cantares, além de turmas de piano.'),
  ('sons-e-sonhos', 'Sons e Sonhos', 'cultura', 'Parceria com a Orquestra Acadêmica do Ifes Campus Vitória.'),
  ('musica-classica-nas-montanhas', 'Música Clássica nas Montanhas', 'cultura', 'Ensino de cordas friccionadas e acesso ao repertório erudito.'),
  ('scfv', 'SCFV', 'cultura', 'Serviço de Convivência e Fortalecimento de Vínculos, com o CRAS.'),
  ('artes-marciais', 'Artes Marciais', 'esporte', 'Jiu-jitsu e kickboxing gratuitos, com medalhas no Estadual.'),
  ('voleibol-feminino', 'Voleibol Feminino', 'esporte', 'Treinos gratuitos para meninas de 8 a 17 anos.'),
  ('voleibol-misto', 'Voleibol Misto', 'esporte', 'Vôlei para adultos em parceria com a OAB e a CAAES.'),
  ('hidroginastica', 'Hidroginástica 60+', 'esporte', 'Aulas gratuitas para pessoas com 60 anos ou mais. Inscrições abertas!')
on conflict (id) do update set nome = excluded.nome, area = excluded.area, resumo = excluded.resumo;

insert into public.turmas (id, projeto_id, nome, dias, inicio, fim, local, vagas) values
  ('ojt-violino-b', 'orquestra-jonice-tristao', 'Violino — Elementar B', '{1,3}', '14:00', '15:30', 'Sede do Instituto · Sala 2', 4),
  ('ojt-cello', 'orquestra-jonice-tristao', 'Violoncelo e Contrabaixo', '{2,4}', '14:00', '15:30', 'Sede do Instituto · Sala 3', 2),
  ('ojt-ensaio', 'orquestra-jonice-tristao', 'Ensaio geral da orquestra', '{6}', '09:00', '11:00', 'Sede do Instituto · Salão', 0),
  ('viola-caipira', 'orquestra-de-viola', 'Viola caipira', '{5}', '15:00', '17:00', 'Sede do Instituto', 6),
  ('musi-infantil', 'musicalizacao-infantil', 'Musicalização 4 a 6 anos', '{2}', '09:00', '10:00', 'Sede do Instituto · Sala 1', 5),
  ('coral-infantil', 'corais-das-montanhas', 'Coral Infantil', '{3}', '15:30', '17:00', 'Sede do Instituto · Salão', 8),
  ('coro-jovem', 'corais-das-montanhas', 'Coro Jovem', '{4}', '18:30', '20:00', 'Sede do Instituto · Salão', 6),
  ('piano', 'corais-das-montanhas', 'Piano', '{1}', '16:00', '17:00', 'Sede do Instituto · Sala 4', 1),
  ('sopros-rural', 'musicalizacao-agricola', 'Sopros — núcleo rural', '{2,4}', '08:00', '10:00', 'Núcleo rural (conforme a comunidade)', 7),
  ('jiu-jitsu', 'artes-marciais', 'Jiu-jitsu', '{1,3}', '08:30', '10:00', 'Sede do Instituto · Tatame', 5),
  ('volei-fem', 'voleibol-feminino', 'Vôlei Feminino (8 a 17 anos)', '{4}', '18:00', '20:00', 'Quadra Anadir Barone', 3),
  ('volei-vni', 'voleibol-misto', 'Vôlei Misto — Venda Nova', '{1,4}', '20:00', '21:30', 'Venda Nova do Imigrante', 4),
  ('hidro-60', 'hidroginastica', 'Hidroginástica 60+', '{2,5}', '07:30', '08:30', 'A confirmar', 20)
on conflict (id) do update set nome = excluded.nome, dias = excluded.dias, inicio = excluded.inicio, fim = excluded.fim, local = excluded.local, vagas = excluded.vagas;

insert into public.calendario (tipo, titulo, inicio, fim) values
  ('feriado', 'Confraternização Universal', '2026-01-01', null),
  ('feriado', 'Carnaval — sem aulas', '2026-02-16', '2026-02-18'),
  ('marco', 'Início do 1º semestre', '2026-02-23', null),
  ('feriado', 'Sexta-feira Santa', '2026-04-03', null),
  ('feriado', 'Nossa Senhora da Penha (ES)', '2026-04-13', null),
  ('feriado', 'Tiradentes', '2026-04-21', null),
  ('feriado', 'Dia do Trabalho', '2026-05-01', null),
  ('feriado', 'Corpus Christi', '2026-06-04', null),
  ('marco', 'Fim do 1º semestre', '2026-07-10', null),
  ('recesso', 'Recesso de julho', '2026-07-13', '2026-07-24'),
  ('marco', 'Início do 2º semestre', '2026-07-27', null),
  ('marco', 'Aniversário do Instituto', '2026-08-16', null),
  ('feriado', 'Independência do Brasil', '2026-09-07', null),
  ('feriado', 'Nossa Senhora Aparecida', '2026-10-12', null),
  ('feriado', 'Finados', '2026-11-02', null),
  ('feriado', 'Consciência Negra', '2026-11-20', null),
  ('reuniao', 'Reunião de pais e responsáveis', '2026-11-28', null),
  ('marco', 'Fim do 2º semestre', '2026-12-11', null),
  ('recesso', 'Férias', '2026-12-14', '2026-12-31'),
  ('feriado', 'Natal', '2026-12-25', null);

insert into public.calendario (tipo, titulo, inicio, hora, local, grupo) values
  ('apresentacao', 'Orquestra de Sopros na Festa do Afonsoclaudense Ausente', '2026-05-19', null, 'Afonso Cláudio', 'Orquestra de Sopros'),
  ('apresentacao', 'Coro Jovem na feira livre', '2026-06-25', null, 'Feira livre de Afonso Cláudio', 'Coro Jovem das Montanhas'),
  ('apresentacao', '1º Festival de Cordas das Montanhas', '2026-07-04', null, 'Afonso Cláudio', 'Orquestra Jônice Tristão'),
  ('apresentacao', 'IV Encontro de Coros Vale Música', '2026-07-04', null, 'Vale Música', 'Coral Infantil e Coro Jovem'),
  ('apresentacao', '31º Festival Internacional de Inverno', '2026-07-18', null, 'Domingos Martins', 'Orquestra de Sopros'),
  ('apresentacao', 'Conecta Sicoob — Parque do China', '2026-09-12', null, 'Domingos Martins', 'Orquestra Jônice Tristão'),
  ('apresentacao', 'Concerto de Rock em benefício do Instituto', '2026-11-07', '19:30', 'A definir', 'AFC 5 e convidados'),
  ('apresentacao', 'VIJAZZ — música instrumental nas montanhas', '2026-11-21', '19:00', 'Praça Aderbal Galvão', 'Alunos e convidados'),
  ('apresentacao', 'Concerto de fim de ano', '2026-12-12', '18:00', 'Sede do Instituto', 'Orquestra Jônice Tristão'),
  ('apresentacao', 'Cantata de Natal', '2026-12-19', '19:00', 'Igreja Matriz', 'Corais das Montanhas');
