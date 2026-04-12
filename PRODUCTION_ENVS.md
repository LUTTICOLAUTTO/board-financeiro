# Production Envs

## Obrigatórias

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `MONDAY_API_TOKEN`
- `MONDAY_BOARD_ID`
- `MONDAY_GROUP_DIAGNOSTICO_ID`
- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_SESSIONS_JSON`

## Recomendação prática

### OpenAI

- `OPENAI_MODEL=gpt-5.2`

### Banco

- usar Postgres gerenciado
- opções simples: Neon, Supabase, Railway

### Admin

- `ADMIN_EMAIL` deve ser um email interno da Lampada
- `ADMIN_PASSWORD` deve ser forte e exclusiva para esse app

### CLIENT_SESSIONS_JSON

Modelo:

```json
{
  "chevrolet-sonic": {
    "name": "Chevrolet Sonic Sessions",
    "eyebrow": "Chevrolet x Lampada",
    "title": "Diagnóstico de Lançamento Chevrolet Sonic",
    "intro": "Uma sessão guiada para organizar o projeto, clarificar a tese de negócio e acelerar a próxima decisão com a Lampada.",
    "badges": [
      "Sessão dedicada",
      "Diagnóstico consultivo",
      "Próximo passo claro"
    ],
    "flowTitle": "O que acontece depois",
    "flowSteps": [
      "Você compartilha o contexto real",
      "A Lampada estrutura o diagnóstico",
      "O caso é qualificado internamente",
      "Voltamos com recomendação objetiva"
    ],
    "wizardKicker": "Sessão dedicada Chevrolet",
    "wizardTitle": "Descoberta estratégica do projeto",
    "thankYouTitle": "Briefing recebido com sucesso",
    "thankYouText": "Recebemos seu briefing e já vamos organizar a próxima leitura estratégica.",
    "accessCode": "lampada-sonic-2026",
    "branding": {
      "primary": "#0a6c63",
      "accent": "#c27b21"
    }
  }
}
```

## Domínios sugeridos

- público: `briefing.lampada.ag`
- admin: `briefing.lampada.ag/admin`

## Teste mínimo após deploy

1. abrir rota pública
2. abrir rota client-facing com token
3. validar código de acesso da sessão
4. enviar um briefing
5. confirmar criação no admin
6. confirmar criação no Monday
