# Release Checklist

## Produto público

- homepage em `/` comunica claramente a proposta do produto
- CTA principal leva para `/briefing`
- `/briefing` abre com o fluxo novo de 4 etapas
- checklist de cobertura aparece antes do envio
- resultado mostra briefing reorganizado, perguntas, premissas, gates, score e pricing

## Sessões privadas

- `/sessions` explica o modelo sem listar clientes
- links `/c/[token]` funcionam por acesso direto
- branding por cliente aparece corretamente
- `accessCode` funciona quando configurado
- página de obrigado carrega depois do submit

## Admin interno

- `/admin/login` autentica com sucesso
- `/admin` lista submissões
- busca, filtros, ordenação e paginação funcionam
- `/admin/submissions/[id]` mostra briefing reorganizado, gates, checklist, score e pricing

## IA e lógica de negócio

- prompt atualizado usa o método novo do agente
- schema aceita briefing classification, gates e checklist
- fallback continua funcionando sem quebrar a UI
- score, pricing e devolutiva client-facing continuam aparecendo

## Operação

- item no Monday é criado
- sessão/origem aparece no board
- banco persiste submissões com `DATABASE_URL`
- fallback local continua útil para desenvolvimento

## Segurança de publicação

- home pública não expõe lista de clientes
- `/sessions` não expõe tokens reais
- admin segue em rota autenticada
- `.env.local` não entra no repositório

## Documentação

- `README.md` atualizado
- `DEPLOY_VERCEL.md` atualizado
- `PRODUCTION_ENVS.md` revisado

## Git

- revisar `git diff`
- revisar `git status`
- stage dos arquivos alterados
- commit com mensagem clara
