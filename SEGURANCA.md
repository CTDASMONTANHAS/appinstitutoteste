# Segurança do app

O app lida com dados de **crianças e adolescentes** (nome, nascimento, escola, ponto da van). Por isso a segurança não fica no app: fica no **banco de dados**, que recusa qualquer acesso indevido mesmo que alguém use o app modificado ou chame a API direto.

## Camadas

| Camada | Como protege |
|---|---|
| **Login** | Usuário e senha (Supabase Auth, senha com hash no servidor, mínimo 6 caracteres). Cadastro aberto **desligado**: contas só são criadas pela coordenação. Freio de tentativas no app e limite no servidor. Login dos alunos: **não** usar CPF (ver abaixo). |
| **RLS (Row Level Security)** | Ativado em **todas** as tabelas (`supabase/schema.sql`). Cada família só lê os próprios alunos; professor só os alunos ativos das suas turmas; coordenação vê tudo. |
| **Escrita controlada** | Ninguém insere aluno direto na tabela. A matrícula só entra pela função `solicitar_matricula()`, que valida, limita a 5 pedidos por responsável por dia e grava sempre como **pendente**. Só a coordenação ativa. |
| **Papéis imutáveis pelo usuário** | O usuário não consegue mudar o próprio papel (responsável → coordenação). Papéis são definidos pela coordenação. |
| **Van** | Guarda só a **posição atual** (sem histórico). Visível apenas para famílias com aluno ativo que usa a van, e só com a van em rota. Só o transporte pode escrever. Coordenadas limitadas à região. |
| **Dados mínimos (LGPD)** | CadÚnico é só sim/não. Não coletamos CPF, NIS nem documentos pelo app. Autorização de imagem é separada e opcional. Aceite LGPD registrado com data. |
| **Navegador** | CSP restritiva (bloqueia scripts de terceiros e inline), SRI nas bibliotecas de CDN, HTML das notícias higienizado, `rel="noopener noreferrer"`, nada de dados pessoais no `localStorage` (modo demo usa `sessionStorage`). |
| **Chaves** | O app usa só a chave pública `anon`. A chave `service_role` **nunca** vai para o app nem para o GitHub. |

## Ativar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) (região São Paulo).
2. **SQL Editor** → rode `supabase/schema.sql` e depois `supabase/seed.sql`. Para a van, siga [VAN.md](VAN.md).
3. **Authentication → Providers → Email**: ative "Email OTP" e, em **Email Templates**, use `{{ .Token }}` no corpo (código de 6 dígitos em vez de link).
4. **Authentication → URL Configuration**: Site URL = `https://ctdasmontanhas.github.io/appinstitutoteste/`.
5. **Authentication → Rate Limits**: mantenha limites baixos para envio de e-mail.
6. Cadastre projetos e turmas (tabelas `projetos`, `turmas`) e defina os papéis da equipe em `perfis.papel` (`coordenacao`, `professor`, `transporte`).
7. Copie **Project URL** e **anon public key** (Project Settings → API) para `js/config.js`.

## Antes de ir para produção
- [ ] Revisão do `schema.sql` testando com 3 contas (responsável A, responsável B, professor) que uma não vê dados da outra.
- [ ] App do transporte para enviar o GPS da van (escreve em `van_posicao_atual`).
- [ ] Painel da coordenação para ativar matrículas, lançar frequência e avisos.
- [ ] Termo de uso de dados revisado juridicamente.
- [ ] Domínio próprio com HTTPS e cabeçalhos de segurança (no GitHub Pages a CSP vai por `<meta>`).
- [ ] Provedor de mapa com chave própria se o uso crescer (os blocos do OpenStreetMap têm política de uso justo).

## Login dos alunos (decisão pendente)
Proposta inicial: matrícula + 4 primeiros dígitos do CPF. **Não recomendado**: só 10 mil combinações (descobertas por tentativa) e o CPF é conhecido por muita gente — daria acesso à posição da van. Alternativas:
- matrícula + senha de 6 dígitos criada pela família no 1º acesso; ou
- matrícula + código de 6 dígitos enviado ao WhatsApp do responsável.
