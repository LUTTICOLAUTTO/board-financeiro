# Use Cases

## Quando usar a skill orquestradora

Use `briefing-agent` quando:

- o material ainda esta confuso e voce nao sabe qual modulo acionar
- o pedido mistura briefing, score e precificacao
- voce quer uma primeira leitura completa do caso

## Quando usar as skills menores

- `lampada-client-briefing`: conversa com cliente, intake, perguntas estrategicas
- `lampada-score`: decisao de perseguir ou nao
- `lampada-pricing`: faixa de investimento e protecao de margem
- `lampada-white-label`: devolutiva cliente-facing
- `lampada-monday-ops`: registro e gestao no Monday

## Sequencias recomendadas

### Caso novo

1. `lampada-client-briefing`
2. `lampada-score`
3. `lampada-pricing`
4. `lampada-monday-ops`

### Pedido interno rapido

1. `briefing-agent`
2. `lampada-score`
3. `lampada-pricing`

### Diagnostico pago

1. `lampada-client-briefing`
2. `lampada-score`
3. `lampada-pricing`
4. `lampada-white-label`
