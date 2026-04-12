# Lampada Diagnostico App

App client-facing em Next.js para captar briefing, gerar diagnostico no metodo Lampada com a OpenAI e registrar o caso no Monday.

## Stack

- Next.js
- OpenAI Responses API
- Zod para Structured Outputs
- Monday GraphQL API

## Setup

1. Copie `.env.example` para `.env.local`
2. Preencha:
   - `OPENAI_API_KEY`
   - `MONDAY_API_TOKEN`
   - `CLIENT_SESSIONS_JSON` se quiser links dedicados por cliente
3. Instale dependencias:

```bash
npm install
```

4. Rode localmente:

```bash
npm run dev
```

## Fluxo

1. Cliente preenche o formulario
2. `POST /api/diagnose` monta o prompt Lampada
3. A OpenAI retorna diagnostico + score + pricing + devolutiva cliente-facing
4. O app salva o historico em Postgres se `DATABASE_URL` existir; caso contrario usa `data/submissions.json`
5. O app cria um item no board do Monday
6. O cliente e redirecionado para uma pagina final de agradecimento

## Links dedicados por cliente

Voce pode criar links compartilhaveis como:

- `/c/chevrolet-sonic`
- `/c/bmw-awards`

Esses links sao definidos em `CLIENT_SESSIONS_JSON`.

Exemplo:

```json
{
  "chevrolet-sonic": {
    "name": "Chevrolet Sonic Sessions",
    "eyebrow": "Chevrolet x Lampada",
    "title": "Diagnóstico de Lançamento Chevrolet Sonic"
  }
}
```

Depois disso, o link fica:

```text
https://seu-dominio.com/c/chevrolet-sonic
```

Se quiser acesso simples por cliente, inclua `accessCode` na sessão. O app cria uma barreira leve antes do formulário e grava um cookie de acesso.

## Deploy recomendado

### Vercel

1. subir o repo para GitHub
2. importar o projeto na Vercel
3. configurar as variaveis de ambiente
4. fazer o deploy

Variaveis minimas:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `MONDAY_API_TOKEN`
- `MONDAY_BOARD_ID`
- `MONDAY_GROUP_DIAGNOSTICO_ID`
- `DATABASE_URL`
- `CLIENT_SESSIONS_JSON`

## Produção

Camadas prontas no app:

- autenticacao simples por sessao client-facing
- branding por cliente via `CLIENT_SESSIONS_JSON`
- pagina final de agradecimento em `/c/[token]/obrigado`
- geracao automatica de score, pricing e devolutiva executiva
- painel admin interno em `/admin`
- autenticacao simples da equipe Lampada com email e senha

## Painel interno

Rotas:

- `/admin/login`
- `/admin`
- `/admin/submissions/[id]`

O painel interno le as submissões salvas localmente e permite:

- listar diagnósticos
- abrir score e pricing completos
- ver a devolutiva cliente-facing
- abrir a página final do cliente

Com `DATABASE_URL`, o painel passa a ler do Postgres automaticamente.

## Persistencia

Camada atual:

- produção recomendada: Postgres via `DATABASE_URL`
- fallback de desenvolvimento: `data/submissions.json`

## Deploy

Veja o checklist em [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)
Veja também as variáveis em [PRODUCTION_ENVS.md](./PRODUCTION_ENVS.md)

## Arquivos principais

- `app/page.js`: tela principal
- `app/c/[token]/page.js`: links dedicados por cliente
- `app/c/[token]/obrigado/page.js`: pagina final client-facing
- `app/admin/login/page.js`: login interno
- `app/admin/page.js`: painel interno
- `app/admin/submissions/[id]/page.js`: detalhe do diagnóstico
- `app/api/diagnose/route.js`: backend do formulario
- `app/api/session-access/route.js`: autenticacao simples por codigo
- `app/api/admin/login/route.js`: login do admin
- `app/api/admin/logout/route.js`: logout do admin
- `app/api/submissions/[id]/route.js`: leitura de submissao
- `lib/openai.js`: integracao com OpenAI
- `lib/monday.js`: envio para Monday
- `lib/persistence.js`: persistencia local
- `lib/client-sessions.js`: configuracao das sessoes client-facing
- `lib/session-auth.js`: cookie de acesso por sessao
- `lib/admin-auth.js`: autenticacao interna da equipe

## Fontes oficiais

- OpenAI quickstart: https://platform.openai.com/docs/quickstart
- Responses API e Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs?lang=javascript
- Migrate to Responses: https://platform.openai.com/docs/guides/migrate-to-responses
