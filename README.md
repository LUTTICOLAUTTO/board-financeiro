# Lampada Diagnostico App

Webapp público e client-facing em Next.js para captar briefing, reorganizar o caso no método Lampada, gerar diagnóstico com score e pricing, e registrar tudo no admin e no Monday.

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

1. A homepage pública apresenta a proposta da plataforma
2. O cliente entra no fluxo em `/briefing` ou por um link dedicado `/c/[token]`
3. O app coleta o briefing em quatro blocos: base comercial, escopo, operação e experiência
4. `POST /api/diagnose` monta o prompt Lampada
5. A OpenAI retorna briefing reorganizado, perguntas, premissas, gates, checklist, score, pricing e devolutiva client-facing
6. O app salva o histórico em Postgres se `DATABASE_URL` existir; caso contrário usa `data/submissions.json`
7. O app cria um item no board do Monday
8. O cliente é redirecionado para uma página final de agradecimento

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

- homepage pública comercial em `/`
- autenticacao simples por sessao client-facing
- branding por cliente via `CLIENT_SESSIONS_JSON`
- pagina final de agradecimento em `/c/[token]/obrigado`
- geracao automatica de score, pricing e devolutiva executiva
- painel admin interno em `/admin`
- autenticacao simples da equipe Lampada com email e senha
- checklist operacional e gates de decisão no diagnóstico

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

- `app/page.js`: landing pública
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

## Publicação segura

- a home pública não lista clientes
- a página `/sessions` explica o funcionamento das sessões privadas sem expor tokens reais
- links dedicados continuam sendo distribuídos pela equipe da Lampada

## Fontes oficiais

- OpenAI quickstart: https://platform.openai.com/docs/quickstart
- Responses API e Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs?lang=javascript
- Migrate to Responses: https://platform.openai.com/docs/guides/migrate-to-responses
