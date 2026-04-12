---
name: lampada-score
description: Use esta skill quando precisar aplicar um criterio empresarial ao projeto e decidir se vale avancar. Ela pontua briefing, cliente, complexidade, margem, relacionamento e risco reputacional, calcula o score final e traduz isso em uma recomendacao objetiva de avancar, ajustar ou repensar.
---

# Lampada Score

## Overview

Esta skill funciona como comite estrategico da Lampada. O papel dela e reduzir decisao intuitiva e gerar um criterio defendavel para priorizar, ajustar ou recusar projetos.

## Score Dimensions

- clareza do briefing
- maturidade do cliente
- complexidade operacional
- potencial de margem
- potencial de relacionamento
- risco reputacional

## Required Output

Entregue:

1. nota de 0 a 10 para cada dimensao
2. racional de cada nota
3. score final de 0 a 100
4. classificacao:
   verde 80-100
   amarelo 60-79
   vermelho abaixo de 60
5. recomendacao executiva

## Core Rules

- nao trate score como enfeite
- sempre explique o que puxou o projeto para cima ou para baixo
- se o briefing estiver fraco, isso precisa doer no score
- uma boa margem nao compensa tudo; risco reputacional e governanca importam

## Escalation

Depois do score:

- use `lampada-pricing` se o projeto merecer enquadramento financeiro
- use `lampada-monday-ops` para registrar score e decisao no board operacional

Para a matriz de peso e exemplos, leia `references/score-matrix.md`.
