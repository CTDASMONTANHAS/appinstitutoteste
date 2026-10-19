# App do Instituto Cultural das Montanhas — protótipo

PWA (instalável no celular) em HTML, CSS e JavaScript puros, sem build.

**Visual:** grafite escuro com neumorfismo (relevo suave), botões em pílula, formas geométricas ao fundo e dourado só nos detalhes. Fonte Mulish.

## Telas
| Rota | Tela |
|---|---|
| `#/inicio` | Destaque, atalhos (doar, inscrever, ouvidoria, instituto), inscrições abertas, projetos, impacto, eventos e últimas notícias |
| `#/projetos` · `#/projeto/:id` | Projetos de cultura e esporte (filtro), detalhes, horários, local e notícias do projeto |
| `#/inscricao/:id` | Formulário de inscrição gratuita |
| `#/agenda` | Semana, filtros e eventos com lembrete |
| `#/noticias` · `#/noticia/:slug` | **Notícias reais**, lidas ao vivo da API do blog do site |
| `#/eu` | Login/cadastro → código de 4 dígitos → carteirinha digital, frequência, próximas aulas, avisos, van, justificar falta |
| `#/checkin` | Check-in na aula (radar) |
| `#/doar` | PIX (copiar chave), valores, FIA, Nota Premiada, patrocínio |
| `#/ouvidoria` | Elogio/sugestão/dúvida/reclamação (anônimo ou não) e canais |
| `#/sobre` | Missão, visão, valores, trajetória e transparência |

## O que é real e o que é demonstração
- **Real:** notícias (API `institutoculturaldasmontanhas.org/blog/api/posts.php`), projetos, números, contatos, PIX e imagens do site oficial.
- **Demonstração:** agenda, área do aluno (dados fictícios), formulários (não enviam nada) e textos de impacto da doação.

## Rodar localmente
```bash
python -m http.server 8790
```
Acesse `http://localhost:8790`. Ao alterar JS/CSS, suba o `?v=N` no `index.html` e o nome do cache em `sw.js`.

## Arquivos
- `index.html` — casca do app, barra superior, abas e tela de abertura
- `css/app.css` — tema e componentes
- `js/data.js` — dados (projetos, agenda, aluno demo, linha do tempo)
- `js/app.js` — rotas e telas
- `manifest.json`, `sw.js`, `icons/` — PWA
