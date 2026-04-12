---
name: lampada-monday-ops
description: Use esta skill quando precisar operar o fluxo Lampada dentro do Monday. Ela serve para registrar projetos, preencher diagnostico, score, precificacao, decisao e proximo passo no board operacional, mantendo rastreabilidade e governanca comercial.
---

# Lampada Monday Ops

## Overview

Esta skill conecta o metodo Lampada ao Monday de forma operacional. Ela existe para impedir que briefing, score e precificacao morram no chat e nao virem gestao real.

## Primary Board

Use como board principal:

- `Lampada - Pipeline de Diagnostico`

O mapa real do board, com IDs de colunas, grupos e regras de uso, esta em `references/monday-board-map.md`.

## Workflow

1. criar ou localizar o item do projeto
2. preencher resumo executivo
3. registrar perguntas bloqueadoras
4. registrar riscos ocultos
5. preencher hipoteses e premissas
6. atualizar maturidade do briefing
7. preencher score final e decisao executiva
8. preencher faixa recomendada, faixa minima e margem estimada
9. atualizar fase Lampada e andamento
10. definir proximo passo

## Core Rules

- nada entra em proposta sem passar por briefing minimo
- score e precificacao devem ficar registrados no item, nao so em texto solto
- use updates para contexto adicional ou handoff
- se o projeto travar, o motivo precisa aparecer em `Perguntas Bloqueadoras` ou `Riscos Ocultos`

## Group Logic

- `01 Intake`: entrada e triagem
- `02 Diagnostico`: briefing, perguntas e riscos
- `03 Proposta`: projeto apto para proposta
- `04 Won / Handoff`: projeto ganho e transferido
- `05 Lost / Arquivo`: perdido, recusado ou encerrado

## Typical Use Cases

- criar um item novo a partir de um briefing
- atualizar score e decisao
- puxar fila de itens bloqueados
- preparar handoff para proposta ou execucao

Para IDs reais, labels e procedimentos de operacao, leia `references/monday-board-map.md`.
