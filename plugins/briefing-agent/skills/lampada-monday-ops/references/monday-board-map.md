# Monday Board Map

## Board principal

- nome: `Lampada - Pipeline de Diagnostico`
- id: `18408293243`
- url: `https://lampadaag-company.monday.com/boards/18408293243`

## Grupos

- `01 Intake` -> `group_mm2b4x4e`
- `02 Diagnostico` -> `group_mm2b1c4r`
- `03 Proposta` -> `group_mm2bpebc`
- `04 Won / Handoff` -> `group_mm2bxjg5`
- `05 Lost / Arquivo` -> `group_mm2b5jxw`

Nota: o Monday criou tambem o grupo padrao `topics` com titulo `Group Title`. Hoje ele esta ocioso e pode ser mantido vazio ou renomeado manualmente depois para `Templates`.

## Colunas

- `Cliente` -> `text_mm2bytpq`
- `Tipo de Projeto` -> `text_mm2b3hs9`
- `Dono Comercial` -> `multiple_person_mm2bt7xe`
- `Data do Evento` -> `date_mm2be1fg`
- `Fase Lampada` -> `color_mm2bjdyr`
- `Andamento` -> `color_mm2bxrgf`
- `Maturidade do Briefing` -> `color_mm2b61fh`
- `Score Final` -> `numeric_mm2b2dw`
- `Decisao Executiva` -> `color_mm2b5ex8`
- `Margem Estimada` -> `color_mm2b1hrj`
- `Faixa Recomendada` -> `text_mm2b7szx`
- `Faixa Minima` -> `text_mm2b361d`
- `Perguntas Bloqueadoras` -> `long_text_mm2bcpd`
- `Riscos Ocultos` -> `long_text_mm2b68dp`
- `Proximo Passo` -> `long_text_mm2b4fdt`
- `Resumo Executivo` -> `long_text_mm2bzdgx`
- `Hipoteses e Premissas` -> `long_text_mm2bybyh`

## Labels

### Fase Lampada

- Intake
- Diagnostico
- Score
- Precificacao
- Proposta
- Handoff
- Arquivado

### Andamento

- Novo
- Em analise
- Aguardando cliente
- Bloqueado
- Concluido

### Maturidade do Briefing

- Baixo
- Medio
- Alto

### Decisao Executiva

- Avancar
- Ajustar
- Repensar
- Recusar

### Margem Estimada

- Baixa
- Media
- Alta

## Operacao recomendada

1. item nasce em `01 Intake`
2. briefing e perguntas bloqueadoras sao preenchidos
3. projeto vai para `02 Diagnostico`
4. score e precificacao sao registrados
5. se aprovado, move para `03 Proposta`
6. se ganho, vai para `04 Won / Handoff`
7. se perdido ou recusado, vai para `05 Lost / Arquivo`

## Template criado

- item: `TEMPLATE - Novo Projeto Lampada`
- item id: `11728173246`

Use esse item como referencia de preenchimento.

## Ritual de uso

### Entrada

- todo caso novo entra em `01 Intake`
- nome do item: `Cliente - Projeto - Mes/Ano` ou `Marca - Entrega - Janela`
- preencher no minimo:
  - Cliente
  - Tipo de Projeto
  - Resumo Executivo
  - Perguntas Bloqueadoras
  - Maturidade do Briefing
  - Proximo Passo

### Diagnostico

- mover para `02 Diagnostico`
- atualizar `Fase Lampada` para `Diagnostico`
- registrar riscos, hipoteses e premissas
- se faltar dado critico, `Andamento` deve virar `Aguardando cliente` ou `Bloqueado`

### Decisao

- rodar `lampada-score`
- preencher `Score Final` e `Decisao Executiva`
- rodar `lampada-pricing`
- preencher `Faixa Recomendada`, `Faixa Minima` e `Margem Estimada`

### Saida

- se o projeto seguir, mover para `03 Proposta`
- se ganhar, mover para `04 Won / Handoff`
- se nao fizer sentido seguir, mover para `05 Lost / Arquivo`
