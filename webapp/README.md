# Lampada Webapp

## O que e

Este e um prototipo client-facing para transformar o sistema Lampada em uma experiencia web mais amigavel para clientes.

Hoje ele faz:

- fluxo guiado em 4 etapas
- coleta de contexto, objetivo, publico e restricoes
- geracao local de um diagnostico-base
- pre-formatacao de perguntas bloqueadoras

## Como abrir

Abra `index.html` no navegador.

## Como isso vira produto real

### Camada 1. Frontend

Esta interface vira a experiencia que o cliente acessa por link.

### Camada 2. Backend

O backend recebe o formulario e chama o agente Lampada pela API da OpenAI.

Fluxo recomendado:

1. frontend envia respostas
2. backend monta prompt do modulo certo
3. backend chama o modelo
4. backend salva resposta estruturada
5. backend atualiza o Monday

### Camada 3. Persistencia

Minimo recomendado:

- `projects`
- `briefings`
- `scores`
- `pricing_runs`
- `client_reports`

### Camada 4. Monday

Depois de gerar o diagnostico:

1. criar ou localizar item no board Lampada
2. preencher resumo executivo
3. preencher perguntas bloqueadoras
4. preencher score e precificacao
5. mover fase conforme o workflow

## Stack recomendada

Para sair do prototipo e virar app de verdade:

- `Next.js` no frontend/backend
- `OpenAI API` para os agentes
- `Postgres` para historico
- `Monday API` para pipeline operacional
- `Vercel` para deploy rapido

## Ordem certa de evolucao

1. validar UX com esse prototipo
2. ligar o submit a um backend
3. gerar resposta real com IA
4. persistir no banco
5. sincronizar com Monday
6. adicionar autenticacao e links por cliente
