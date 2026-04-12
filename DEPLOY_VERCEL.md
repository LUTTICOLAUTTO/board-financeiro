# Deploy na Vercel

## Checklist

### 1. Repositório

- subir este projeto para GitHub
- confirmar que o diretório raiz do app e este mesmo

### 2. Projeto na Vercel

- importar o repositório
- framework detectado: `Next.js`
- root directory: `.`

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

### 4. Domínio

Recomendação:

- app público: `briefing.lampada.ag`
- admin interno: `briefing.lampada.ag/admin`

### 5. Fluxos para testar

- rota pública `/`
- rota dedicada `/c/chevrolet-sonic`
- autenticação simples da sessão
- submit do briefing
- redirecionamento para `/obrigado`
- criação do item no Monday
- login em `/admin/login`
- listagem em `/admin`
- detalhe em `/admin/submissions/[id]`

### 6. Observações

- a estrutura agora ja suporta Postgres diretamente por `DATABASE_URL`
- sem `DATABASE_URL`, o app cai para persistencia local, util para dev mas inadequada para producao seria
