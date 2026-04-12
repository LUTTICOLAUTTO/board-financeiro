# Release Checklist

## Git

- criar branch dedicada
- revisar `git status`
- confirmar `.env.local` fora do versionamento
- revisar `README.md` e `DEPLOY_VERCEL.md`

## Produto

- rota pública abre
- rota client-facing dedicada abre
- autenticação simples por cliente funciona
- submit gera diagnóstico
- página de obrigado abre com `id`

## Comercial

- score aparece no app
- pricing aparece no app
- devolutiva client-facing aparece no app
- admin lista submissões
- admin filtra por score e pricing
- admin abre detalhe do caso

## Operação

- item no Monday é criado
- resumo vai no update do item
- sessão/origem aparece no board

## Deploy

- variáveis de ambiente preenchidas na Vercel
- domínio configurado
- testes básicos feitos em produção
- acesso interno em `/admin/login` validado
