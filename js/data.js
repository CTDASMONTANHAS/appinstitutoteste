/*
 * Dados do protótipo. Projetos, números e linha do tempo vêm do site oficial;
 * agenda e "Minha área" são ilustrativos (sem dados reais de alunos).
 */
const SITE = "https://www.institutoculturaldasmontanhas.org";
const BLOG_API = `${SITE}/blog/api/posts.php`;

const INSTITUTO = {
  nome: "Instituto Cultural das Montanhas",
  razao: "Instituto Três Pontões de Ação Social e Cultural",
  cnpj: "51.892.817/0001-52",
  whatsapp: "5527996996584",
  telefone: "(27) 99699-6584",
  email: "institutodasmontanhas@gmail.com",
  ouvidoria: "ouvidoriadasmontanhas@gmail.com",
  endereco: "Rua Alcino Martins de Souza, 110 — João Valim, Afonso Cláudio/ES",
  instagram: "https://www.instagram.com/institutodasmontanhas",
  youtube: "https://www.youtube.com/@institutoculturaldasmontan8847",
  missao: "Promover o desenvolvimento humano e social por meio de ações culturais, esportivas e educacionais, criando oportunidades que transformam vidas e fortalecem comunidades.",
  visao: "Ser referência na transformação social nas montanhas capixabas, ampliando o acesso à cultura, educação e inclusão para todos.",
  valores: "Transparência, respeito, inclusão, responsabilidade social e transformação através da educação.",
};

const NUMEROS = [
  { valor: "+500", rotulo: "famílias atendidas" },
  { valor: "494", rotulo: "alunos em 2025" },
  { valor: "R$ 136 mil", rotulo: "em bolsas auxílio" },
  { valor: "+5 ton", rotulo: "de alimentos" },
];

const img = (nome) => `${SITE}/assets/img/${nome}`;

const PROJETOS = [
  {
    id: "orquestra-jonice-tristao", area: "cultura", tag: "Cordas friccionadas",
    nome: "Orquestra Jônice Tristão", foto: img("orquestra-jonice-tristao-hero.jpg"),
    resumo: "Primeiro grupo de cordas friccionadas de Afonso Cláudio e região, com cerca de 60 alunos.",
    texto: "Fundada em abril de 2025, atende cerca de 60 alunos com aulas de violino, viola, violoncelo e contrabaixo acústico. Pioneira na captação pela Lei Rouanet na região, hoje é mantida pelo Grupo Tristão com apoio da Fundação Jônice Tristão.",
    publico: "Crianças a partir de 4 anos, jovens e adultos", local: "Sede do Instituto",
    horarios: ["Turmas por instrumento e nível — consulte a secretaria"],
  },
  {
    id: "orquestra-de-viola", area: "cultura", tag: "Viola caipira",
    nome: "Orquestra de Viola das Montanhas", foto: img("orquestra-viola-hero.jpg"),
    resumo: "Prática coletiva de viola caipira que celebra a música de raiz da região.",
    texto: "Realizada pelo Termo de Fomento nº 998728/2026 com o Ministério da Cultura, sob regência do professor Beto Calil. Dá continuidade ao resgate da histórica Orquestra de Viola Filhos de Francisco.",
    publico: "Crianças, adolescentes e jovens", local: "Sede do Instituto",
    horarios: ["Aulas semanais em grupo"],
  },
  {
    id: "musicalizacao-infantil", area: "cultura", tag: "Iniciação",
    nome: "Musicalização Infantil", foto: img("musicalizacao-infantil-hero.jpg"),
    resumo: "Primeiro contato das crianças com ritmo, escuta e música.",
    texto: "Atividades lúdicas, jogos rítmicos, canto, percussão corporal e experimentação de instrumentos. Inclui a Orquestra Infantil, porta de entrada para as cordas friccionadas.",
    publico: "Crianças a partir de 4 anos", local: "Sede do Instituto",
    horarios: ["Turmas matutinas e vespertinas"],
  },
  {
    id: "musicalizacao-agricola", area: "cultura", tag: "Zona rural",
    nome: "Musicalização Agrícola", foto: img("musicalizacao-agricola-hero.jpg"),
    resumo: "Violão, sopros e percussão levados às comunidades rurais.",
    texto: "Viabilizado pela LICC com patrocínio da EDP Espírito Santo, já na 3ª edição. Organizado em 6 núcleos formativos em 3 turnos. Dele nasceu a Orquestra de Sopros das Montanhas.",
    publico: "Crianças, adolescentes e jovens do campo", local: "6 núcleos em comunidades rurais",
    horarios: ["3 turnos — conforme o núcleo"],
  },
  {
    id: "corais-das-montanhas", area: "cultura", tag: "Vozes",
    nome: "Corais das Montanhas", foto: img("corais-das-montanhas-hero.jpg"),
    resumo: "Coral Infantil, Coro Jovem e Coral Cantares, além de turmas de piano.",
    texto: "Formação vocal, pianística e cênica pela LICC com patrocínio da EDP. Conta com preparação cênica e acompanhamento psicossocial.",
    publico: "Crianças, jovens e adultos", local: "Sede do Instituto",
    horarios: ["Coral Infantil A, B e C", "Coro Jovem", "Coral Cantares"],
  },
  {
    id: "sons-e-sonhos", area: "cultura", tag: "Vitória/ES",
    nome: "Sons e Sonhos", foto: img("sons-e-sonhos-hero.jpg"),
    resumo: "Parceria com a Orquestra Acadêmica do Ifes Campus Vitória.",
    texto: "Formação musical gratuita e continuada para 40 alunos na capital, pelo Termo de Fomento nº 033/2025 (emenda parlamentar, apoio da Secult-ES).",
    publico: "40 alunos", local: "Ifes Campus Vitória",
    horarios: ["Cordas e percussão — Orquestra Acadêmica"],
  },
  {
    id: "musica-classica-nas-montanhas", area: "cultura", tag: "Repertório",
    nome: "Música Clássica nas Montanhas", foto: img("orquestra-2.jpg"),
    resumo: "Ensino de cordas friccionadas e acesso ao repertório erudito.",
    texto: "Termo de Fomento nº 007/2026 com a Secult-ES. Aulas coletivas, ensaios e apresentações abertas à comunidade. Os alunos integram a Orquestra Jônice Tristão.",
    publico: "Mínimo de 20 alunos", local: "Sede do Instituto",
    horarios: ["Aulas coletivas e ensaios de conjunto"],
  },
  {
    id: "scfv", area: "cultura", tag: "Convivência",
    nome: "SCFV", foto: img("oficina-1.jpg"),
    resumo: "Serviço de Convivência e Fortalecimento de Vínculos, com o CRAS.",
    texto: "Braço socioassistencial do Instituto, executado em parceria com o CRAS de Afonso Cláudio (Proteção Social Básica do SUAS). Até 100 usuários simultâneos.",
    publico: "Encaminhados pelo CRAS e comunidade", local: "Sede do Instituto",
    horarios: ["Encontros semanais"],
  },
  {
    id: "artes-marciais", area: "esporte", tag: "Tatame",
    nome: "Artes Marciais", foto: img("esporte-4.jpg"),
    resumo: "Jiu-jitsu e kickboxing gratuitos, com medalhas no Estadual.",
    texto: "Cerca de 60 alunos em turmas matutinas e vespertinas, em parceria com a Associação do Botafogo. Sem corte técnico; frequência escolar é condição de permanência.",
    publico: "Crianças, adolescentes e jovens", local: "Sede do Instituto",
    horarios: ["Turmas matutinas e vespertinas"],
  },
  {
    id: "voleibol-feminino", area: "esporte", tag: "Quadra",
    nome: "Voleibol Feminino", foto: img("esporte-1.jpg"),
    resumo: "Treinos gratuitos para meninas de 8 a 17 anos.",
    texto: "Cerca de 40 alunas, com bolsistas monitores, uniformes e material esportivo fornecidos pelo Instituto e acompanhamento psicossocial.",
    publico: "Meninas de 8 a 17 anos", local: "Quadra Anadir Barone (fundos do CMEI Jair Giestas)",
    horarios: ["Quintas, 18h às 20h"],
  },
  {
    id: "voleibol-misto", area: "esporte", tag: "OAB/CAAES",
    nome: "Voleibol Misto", foto: img("esporte-2.jpg"),
    resumo: "Vôlei para adultos em parceria com a OAB e a CAAES.",
    texto: "Voltado ao público adulto — advogados filiados à OAB e comunidade em geral. Expandido para Venda Nova do Imigrante.",
    publico: "Adultos", local: "Afonso Cláudio e Venda Nova do Imigrante",
    horarios: ["VNI: segundas e quintas, 20h"],
  },
  {
    id: "hidroginastica", area: "esporte", tag: "Novo · 60+",
    nome: "Hidroginástica 60+", foto: `${SITE}/blog/uploads/hidroginastica-60-inscricoes-abertas-para-aulas-gratuitas-em-afonso-claudio/capa-6ac95b1b2da94.jpeg`,
    resumo: "Aulas gratuitas para pessoas com 60 anos ou mais. Inscrições abertas!",
    texto: "Primeira vez que o Instituto oferece a modalidade, pelo Centro de Treinamento das Montanhas: exercício seguro, acompanhado e gratuito para a terceira idade.",
    publico: "Pessoas com 60 anos ou mais", local: "A confirmar",
    horarios: ["Inscrições abertas desde 09/10"], novo: true,
  },
];

// Agenda ilustrativa para o protótipo.
const AGENDA = [
  { data: "2026-10-22", hora: "18:00", titulo: "Treino Voleibol Feminino", local: "Quadra Anadir Barone", tipo: "aula" },
  { data: "2026-10-24", hora: "09:00", titulo: "Ensaio geral — Orquestra Jônice Tristão", local: "Sede do Instituto", tipo: "ensaio" },
  { data: "2026-10-31", hora: "—", titulo: "Encerramento das inscrições — Hidroginástica 60+", local: "Secretaria", tipo: "aviso" },
  { data: "2026-11-07", hora: "19:30", titulo: "Concerto de Rock em benefício do Instituto", local: "A definir", tipo: "evento" },
  { data: "2026-11-14", hora: "08:00", titulo: "Supercopa de Voleibol", local: "Ginásio municipal", tipo: "evento" },
  { data: "2026-11-21", hora: "19:00", titulo: "VIJAZZ — Festival de música instrumental", local: "Praça central", tipo: "evento" },
  { data: "2026-11-28", hora: "14:00", titulo: "Reunião de pais e responsáveis", local: "Sede do Instituto", tipo: "aviso" },
  { data: "2026-12-19", hora: "19:00", titulo: "Cantata de Natal — Corais das Montanhas", local: "Igreja Matriz", tipo: "evento" },
];

const LINHA_DO_TEMPO = [
  { ano: 2021, marcos: ["Fundação do Instituto — 16 de agosto"] },
  { ano: 2022, marcos: ["Primeiros projetos nas escolas: 100 atendidos"] },
  { ano: 2024, marcos: ["1º projeto aprovado na LICC", "Utilidade Pública Municipal — Lei nº 2.617/2024"] },
  { ano: 2025, marcos: ["Pioneiro na região pela Lei Rouanet", "Utilidade Pública Estadual — Lei nº 12.580/2025", "Inscrição no CMDCA"] },
  { ano: 2026, marcos: ["Ponto de Cultura — Ministério da Cultura"] },
];

// Perfil fictício para demonstrar a área do aluno.
const ALUNO_DEMO = {
  nome: "Aluno(a) Exemplo",
  matricula: "ICM-2026-0147",
  projeto: "Orquestra Jônice Tristão",
  turma: "Violino — Elementar B",
  professor: "Prof. de Violino",
  frequencia: 92,
  presencas: 23, faltas: 2,
  proximas: [
    { dia: "Qua", data: "22/10", hora: "14:00", aula: "Violino — Elementar B" },
    { dia: "Sáb", data: "24/10", hora: "09:00", aula: "Ensaio geral da orquestra" },
    { dia: "Qua", data: "29/10", hora: "14:00", aula: "Violino — Elementar B" },
  ],
  mensal: [ { m: "Jun", v: 88 }, { m: "Jul", v: 95 }, { m: "Ago", v: 90 }, { m: "Set", v: 100 }, { m: "Out", v: 92 } ],
  avisos: [
    { titulo: "Van: novo horário de saída", texto: "A partir de segunda, a van sai do Centro às 13h20.", quando: "há 2 dias" },
    { titulo: "Uniforme da orquestra", texto: "Traga a camisa preta para o ensaio geral de sábado.", quando: "há 4 dias" },
  ],
};

const CATEGORIAS = {
  geral: "Instituto", "artes-marciais": "Artes Marciais", basquete: "Basquete",
  "corais-das-montanhas": "Corais", "ensino-instrumentos": "Instrumentos",
  "futebol-de-campo": "Futebol", futsal: "Futsal",
  "musica-classica-nas-montanhas": "Música Clássica", "musicalizacao-agricola": "Musicalização Agrícola",
  "musicalizacao-infantil": "Musicalização Infantil", "orquestra-de-viola": "Orquestra de Viola",
  "orquestra-jonice-tristao": "Orquestra Jônice Tristão", scfv: "SCFV", "sons-e-sonhos": "Sons e Sonhos",
  voleibol: "Voleibol", "voleibol-feminino": "Vôlei Feminino", "voleibol-misto": "Vôlei Misto",
};
