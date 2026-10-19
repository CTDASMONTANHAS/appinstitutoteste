# App do Instituto Cultural das Montanhas — protótipo

PWA (instalável no celular) em HTML, CSS e JavaScript puros, sem build, com Supabase como banco.

**Visual:** grafite escuro com neumorfismo, botões em pílula, curvas de nível e serras em camadas (identidade das montanhas), dourado só nos detalhes. Fonte Mulish. Logo oficial em `icones/`.

## Telas
| Aba / rota | O que tem |
|---|---|
| **Início** `#/inicio` | Destaque com a serra, atalhos (matrícula, calendário, van, doar), próxima aula, projetos, apresentações, montanhas, números e notícias |
| **Aulas** `#/aulas` | Aulas do aluno por dia (respeita feriados/recessos), grade semanal, frequência ("altitude"), notícias dos projetos do aluno |
| **Calendário** `#/calendario` | Calendário **letivo 2026** (marcos, feriados, recessos, reuniões) e **de apresentações**, com mês navegável |
| **Van** `#/van` | Mapa de Afonso Cláudio com a van **em tempo real**, trajeto pelas ruas reais, paradas e previsão de chegada no seu ponto |
| **Perfil** `#/perfil` | Carteirinhas dos alunos, nova matrícula, Instituto, notícias, doação, ouvidoria, privacidade |
| `#/matricula` | Matrícula em 5 etapas: responsável → aluno → turma → transporte → termos (LGPD) |
| `#/sobre` | História, missão, montanhas (Três Pontões, Pedra do Gato), linha do tempo, atendidos por bairro, parceiros, transparência |

## Banco de dados e segurança
- **Supabase** (Auth por código no e-mail + Postgres com RLS + Realtime para a van). Esquema em `supabase/schema.sql`.
- Sem configuração em `js/config.js`, o app roda em **modo demonstração**.
- Detalhes e passo a passo: **[SEGURANCA.md](SEGURANCA.md)**.

## O que é real e o que é demonstração
- **Real:** notícias (API do blog do site), projetos, números, contatos, PIX, logo, trajeto da van pelas ruas (OpenStreetMap/OSRM).
- **Demonstração:** horários das turmas (exceto vôlei), calendário letivo (proposta), apresentações futuras, aluno e frequência fictícios, movimento da van (acelerado).

## Rodar localmente
```bash
python -m http.server 8790
```
Acesse `http://localhost:8790`. Ao alterar JS/CSS, suba o `?v=N` no `index.html` e o nome do cache em `sw.js`.

## Arquivos
- `index.html` — casca do app, barra superior, abas e tela de abertura
- `css/app.css` — tema e componentes
- `js/config.js` — URL e chave pública do Supabase (vazio = demonstração)
- `js/db.js` — acesso a dados (Supabase ou demonstração)
- `js/data.js` — projetos, turmas, calendários, montanhas
- `js/rota.js` — trajeto real da van
- `js/app.js` — rotas e telas
- `supabase/schema.sql` — tabelas, regras RLS e função de matrícula
- `manifest.json`, `sw.js`, `icons/` — PWA
