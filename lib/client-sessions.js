const defaultSession = {
  token: "public",
  name: "Experiencia Lampada",
  eyebrow: "Lampada.ag",
  title: "Diagnostico Estrategico de Projetos & Experiencias",
  intro:
    "Uma interface consultiva para estruturar seu projeto com mais clareza, menos ruído e melhores decisões.",
  badges: ["Briefing guiado", "Leitura estratégica", "Próximo passo claro"],
  flowTitle: "Como funciona",
  flowSteps: [
    "Você compartilha o contexto do projeto",
    "O sistema organiza a lógica do pedido",
    "A Lampada qualifica riscos e próximos passos",
    "O caso segue com mais precisão para a equipe"
  ],
  wizardKicker: "Diagnóstico guiado",
  wizardTitle: "Roteiro de descoberta",
  thankYouTitle: "Recebemos seu briefing",
  thankYouText:
    "A Lampada já recebeu as informações e vai usar esse material para estruturar o próximo passo com mais clareza.",
  accessCode: "",
  branding: {
    primary: "#0d6d63",
    accent: "#b9701e"
  }
};

const builtInSessions = {
  "public-demo": {
    name: "Lampada Public Demo",
    eyebrow: "Lampada.ag",
    title: "Diagnóstico Estratégico de Projetos & Experiências",
    intro:
      "Uma demonstração pública da plataforma para entender como a Lampada transforma briefing em critério, score e próximo passo.",
    badges: ["Demo pública", "Método Lampada", "Leitura estratégica"],
    flowTitle: "Como funciona",
    flowSteps: [
      "Você preenche o briefing guiado",
      "O sistema mede cobertura e lacunas",
      "A IA organiza o caso no método Lampada",
      "Você recebe uma leitura executiva"
    ],
    wizardKicker: "Experiência pública",
    wizardTitle: "Teste o método Lampada",
    thankYouTitle: "Diagnóstico recebido",
    thankYouText:
      "Recebemos suas informações e geramos uma leitura inicial do caso.",
    accessCode: "",
    branding: {
      primary: "#0d6d63",
      accent: "#b9701e"
    }
  }
};

function parseSessionConfig() {
  const raw = process.env.CLIENT_SESSIONS_JSON;

  if (!raw) {
    return builtInSessions;
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? {
          ...builtInSessions,
          ...parsed
        }
      : builtInSessions;
  } catch {
    return builtInSessions;
  }
}

export function getAllClientSessions() {
  const sessions = parseSessionConfig();

  return Object.entries(sessions).map(([token, config]) => ({
    ...defaultSession,
    ...config,
    branding: {
      ...defaultSession.branding,
      ...(config.branding || {})
    },
    token
  }));
}

export function getClientSession(token) {
  const sessions = parseSessionConfig();
  const custom = sessions[token];

  if (!custom) {
    return null;
  }

  return {
    ...defaultSession,
    ...custom,
    branding: {
      ...defaultSession.branding,
      ...(custom.branding || {})
    },
    token
  };
}

export function getDefaultSession() {
  return defaultSession;
}

export function getPublicClientSession(token) {
  const session = token ? getClientSession(token) : getDefaultSession();

  if (!session) {
    return null;
  }

  return {
    ...session,
    accessCode: undefined
  };
}
