const mondayConfig = {
  boardId: process.env.MONDAY_BOARD_ID || "18408293243",
  groupId: process.env.MONDAY_GROUP_DIAGNOSTICO_ID || "group_mm2b1c4r",
  columns: {
    client: "text_mm2bytpq",
    projectType: "text_mm2b3hs9",
    phase: "color_mm2bjdyr",
    progress: "color_mm2bxrgf",
    maturity: "color_mm2b61fh",
    score: "numeric_mm2b2dw",
    decision: "color_mm2b5ex8",
    margin: "color_mm2b1hrj",
    recommendedRange: "text_mm2b7szx",
    minimumRange: "text_mm2b361d",
    blocking: "long_text_mm2bcpd",
    risks: "long_text_mm2b68dp",
    nextStep: "long_text_mm2b4fdt",
    summary: "long_text_mm2bzdgx",
    assumptions: "long_text_mm2bybyh"
  }
};

async function mondayGraphQL(query, variables) {
  const token = process.env.MONDAY_API_TOKEN;

  if (!token) {
    return null;
  }

  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ query, variables })
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    const message =
      payload.errors?.[0]?.message || "Falha ao sincronizar com o Monday.";
    throw new Error(message);
  }

  return payload.data;
}

function buildItemName(payload) {
  const brand = payload.brand || payload.sessionName || "Projeto";
  const projectType = payload.realGoal || payload.businessContext || "Diagnostico";
  return `${brand} - ${projectType}`.slice(0, 240);
}

function buildColumnValues(payload, diagnosis) {
  return {
    [mondayConfig.columns.client]: payload.brand || "",
    [mondayConfig.columns.projectType]:
      payload.realGoal || payload.businessContext || payload.sessionName || "",
    [mondayConfig.columns.phase]: { label: diagnosis.recommendedPhase },
    [mondayConfig.columns.progress]: { label: "Em analise" },
    [mondayConfig.columns.maturity]: {
      label:
        diagnosis.maturity === "média"
          ? "Medio"
          : diagnosis.maturity === "alta"
            ? "Alto"
            : "Baixo"
    },
    [mondayConfig.columns.score]: diagnosis.scoreHint,
    [mondayConfig.columns.decision]: { label: diagnosis.decisionHint },
    [mondayConfig.columns.margin]: { label: diagnosis.pricing.margin },
    [mondayConfig.columns.recommendedRange]:
      diagnosis.pricing.recommendedRange || payload.budget || "A definir",
    [mondayConfig.columns.minimumRange]:
      diagnosis.pricing.minimumRange || "Validar faixa minima aceitavel",
    [mondayConfig.columns.blocking]: diagnosis.blockingQuestions.join("\n"),
    [mondayConfig.columns.risks]: diagnosis.attentionPoints.join("\n"),
    [mondayConfig.columns.nextStep]: diagnosis.nextStep,
    [mondayConfig.columns.summary]: diagnosis.summary,
    [mondayConfig.columns.assumptions]:
      "Diagnostico gerado a partir do briefing client-facing. Validar score e pricing na proxima etapa."
  };
}

export async function syncDiagnosisToMonday({ payload, diagnosis }) {
  if (!process.env.MONDAY_API_TOKEN) {
    return {
      synced: false,
      message: "MONDAY_API_TOKEN nao configurado."
    };
  }

  const createItemMutation = `
    mutation CreateItem($boardId: ID!, $groupId: String!, $name: String!, $columnValues: JSON!) {
      create_item(
        board_id: $boardId,
        group_id: $groupId,
        item_name: $name,
        column_values: $columnValues
      ) {
        id
        name
      }
    }
  `;

  const columnValues = JSON.stringify(buildColumnValues(payload, diagnosis));
  const name = buildItemName(payload);

  const created = await mondayGraphQL(createItemMutation, {
    boardId: mondayConfig.boardId,
    groupId: mondayConfig.groupId,
    name,
    columnValues
  });

  const itemId = created.create_item.id;

  const updateMutation = `
    mutation CreateUpdate($itemId: ID!, $body: String!) {
      create_update(item_id: $itemId, body: $body) {
        id
      }
    }
  `;

  await mondayGraphQL(updateMutation, {
    itemId,
    body: [
      "Diagnostico gerado automaticamente pelo app client-facing da Lampada.",
      `Sessao: ${payload.sessionName || payload.sessionToken || "public"}`,
      "",
      `Resumo: ${diagnosis.summary}`,
      "",
      `Score: ${diagnosis.score.total} (${diagnosis.score.band})`,
      `Precificacao: ${diagnosis.pricing.recommendedRange}`,
      "",
      "Perguntas bloqueadoras:",
      ...diagnosis.blockingQuestions.map((item) => `- ${item}`),
      "",
      `Proximo passo: ${diagnosis.nextStep}`
    ].join("\n")
  });

  return {
    synced: true,
    itemId,
    url: `https://lampadaag-company.monday.com/boards/${mondayConfig.boardId}/pulses/${itemId}`
  };
}
