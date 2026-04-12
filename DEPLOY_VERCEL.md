# Deploy na Vercel

## Objetivo

Publicar o webapp público de briefing da Lampada com:

- homepage comercial em `/`
- briefing público em `/briefing`
- sessões privadas por link em `/c/[token]`
- admin interno em `/admin`
- diagnóstico via OpenAI
- persistência em banco
- sincronização com Monday

## Checklist final antes do deploy

### 1. Git e repositório

- confirmar que a branch certa está pronta
- revisar `git status`
- garantir que `.env.local` não está versionado
- subir o branch para o GitHub

### 2. Projeto na Vercel

- importar o repositório na Vercel
- confirmar `Framework Preset = Next.js`
- confirmar `Root Directory = .`
- manter `Build Command` padrão do Next.js

### 3. Variáveis de ambiente

Obrigatórias:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `MONDAY_API_TOKEN`
- `MONDAY_BOARD_ID`
- `MONDAY_GROUP_DIAGNOSTICO_ID`
- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_SESSIONS_JSON`

Recomendação prática:

- usar `OPENAI_MODEL=gpt-5.2` enquanto a operação inicial estabiliza
- usar Postgres real em produção; o fallback local em arquivo serve só para desenvolvimento

### 4. Domínio

Sugestão de estrutura:

- público: `briefing.lampada.ag`
- admin: `briefing.lampada.ag/admin`

Se quiser separar exposição:

- público: `briefing.lampada.ag`
- interno: `ops-briefing.lampada.ag` apontando para o mesmo app com controle por rota

### 5. Sessões privadas

Antes de publicar:

- revisar `CLIENT_SESSIONS_JSON`
- confirmar que apenas links dedicados serão enviados aos clientes
- confirmar códigos de acesso quando a conta pedir camada extra

Importante:

- a home pública não lista clientes
- a página `/sessions` explica o modelo, mas não expõe o índice operacional
- links `/c/[token]` seguem privados por distribuição controlada

### 6. Fluxos para validar em produção

Fluxo público:

- `/` abre como landing comercial
- `/briefing` abre e navega pelos quatro blocos
- o preview de cobertura do briefing atualiza
- o submit gera diagnóstico

Fluxo privado:

- um link `/c/[token]` abre corretamente
- se houver `accessCode`, a barreira funciona
- após submit, o cliente é redirecionado para `/c/[token]/obrigado?id=...`

Fluxo interno:

- `/admin/login` autentica
- `/admin` lista submissões
- filtros e ordenação funcionam
- `/admin/submissions/[id]` abre com score, pricing, gates e checklist

Integrações:

- item no Monday é criado
- resumo chega ao board
- persistência no banco funciona

### 7. Pós-deploy imediato

- testar em desktop e mobile
- revisar cópia da homepage pública
- revisar sessão privada real com um cliente piloto
- validar uma submissão ponta a ponta no admin e no Monday

## Risco principal de produção

O risco mais importante não é visual; é operacional:

- publicar sem `DATABASE_URL`
- publicar sem revisar `CLIENT_SESSIONS_JSON`
- publicar com envs incompletas da OpenAI ou do Monday

## Arquivos para conferir antes de subir

- [README.md](/Users/lutti/Documents/New%20project/README.md)
- [RELEASE_CHECKLIST.md](/Users/lutti/Documents/New%20project/RELEASE_CHECKLIST.md)
- [PRODUCTION_ENVS.md](/Users/lutti/Documents/New%20project/PRODUCTION_ENVS.md)
