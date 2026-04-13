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
  "chevrolet-sonic": {
    name: "Chevrolet Sonic Sessions",
    eyebrow: "Chevrolet x Lampada",
    title: "Diagnóstico Estratégico de Lançamento Chevrolet Sonic",
    intro:
      "Uma sessão guiada para estruturar o projeto com mais clareza, consolidar a tese de negócio e acelerar a próxima decisão com critério.",
    badges: ["Sessão dedicada", "Diagnóstico estratégico", "Próximo passo claro"],
    flowTitle: "Como funciona",
    flowSteps: [
      "Você compartilha o contexto real do projeto",
      "A Lampada reorganiza o briefing em lógica estratégica",
      "O caso passa por score, risco e viabilidade",
      "Voltamos com uma recomendação objetiva"
    ],
    wizardKicker: "Sessão dedicada Chevrolet",
    wizardTitle: "Estruturação estratégica do lançamento",
    thankYouTitle: "Briefing recebido com sucesso",
    thankYouText:
      "Recebemos seu material e vamos transformá-lo em uma leitura mais clara, madura e acionável.",
    accessCode: "lampada-sonic-2026",
    branding: {
      primary: "#0a6c63",
      accent: "#c27b21"
    }
  },
  "bmw-awards": {
    name: "BMW Awards Dinner",
    eyebrow: "BMW x Lampada",
    title: "Diagnóstico Estratégico de Jantar de Premiação BMW",
    intro:
      "Uma sessão dedicada para estruturar o racional do projeto, alinhar critérios de decisão e evitar proposta no escuro.",
    badges: ["Sessão dedicada", "Critério antes do budget", "Governança clara"],
    flowTitle: "Como funciona",
    flowSteps: [
      "Você compartilha o contexto do projeto",
      "A Lampada identifica lacunas, riscos e travas",
      "O caso segue para score e precificação",
      "Voltamos com uma leitura executiva"
    ],
    wizardKicker: "Sessão dedicada BMW",
    wizardTitle: "Estruturação estratégica do projeto",
    thankYouTitle: "Briefing BMW recebido",
    thankYouText:
      "Recebemos as informações e vamos consolidar a próxima leitura do projeto com mais precisão.",
    accessCode: "lampada-bmw-2026",
    branding: {
      primary: "#1d3557",
      accent: "#c08a2d"
    }
  },
  "suhai-festival": {
    name: "Suhai Festival Interlagos",
    eyebrow: "Suhai x Lampada",
    title: "Diagnóstico Estratégico de Naming Rights e Ativações",
    intro:
      "Uma sessão estratégica para organizar escopo, contrapartidas, risco e tese de negócio antes da proposta.",
    badges: ["Sessão dedicada", "Estratégia antes da produção", "Leitura de risco"],
    flowTitle: "Como funciona",
    flowSteps: [
      "Você compartilha contexto, ambição e escopo",
      "A Lampada reorganiza entregas e bloqueadores",
      "O caso avança para score e precificação",
      "Voltamos com recomendação objetiva"
    ],
    wizardKicker: "Sessão dedicada Suhai",
    wizardTitle: "Estruturação estratégica do projeto",
    thankYouTitle: "Briefing Suhai recebido",
    thankYouText:
      "Recebemos o material e vamos convertê-lo em leitura estratégica, score e próximo passo recomendado.",
    accessCode: "lampada-suhai-2026",
    branding: {
      primary: "#6f1d1b",
      accent: "#c77d1f"
    }
  },
  "gm-cdp": {
    name: "GM Clube do Presidente",
    eyebrow: "GM x Lampada",
    title: "Diagnóstico Estratégico de Viagem de Incentivo Premium",
    intro:
      "Uma sessão dedicada para estruturar um briefing sensível, proteger margem e reduzir risco operacional, político e financeiro.",
    badges: ["Conta sensível", "Controle antes do wow", "Governança crítica"],
    flowTitle: "Como funciona",
    flowSteps: [
      "Você compartilha os dados mínimos do projeto",
      "A Lampada reorganiza o briefing em base executável",
      "O caso passa por gates, score e leitura de risco",
      "Voltamos com diagnóstico e próximos passos"
    ],
    wizardKicker: "Sessão dedicada GM",
    wizardTitle: "Estruturação estratégica da experiência",
    thankYouTitle: "Briefing GM recebido",
    thankYouText:
      "Recebemos as informações e vamos estruturar a leitura estratégica com foco em viabilidade, risco e decisão.",
    accessCode: "lampada-gm-cdp-2026",
    branding: {
      primary: "#12344d",
      accent: "#d09a2d"
    }
  },
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
