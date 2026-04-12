const stepButtons = Array.from(document.querySelectorAll(".step"));
const panels = Array.from(document.querySelectorAll(".step-panel"));
const form = document.querySelector("#diagnostic-form");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const submitButton = document.querySelector("#submit-button");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");

const resultState = document.querySelector("#result-state");
const resultCard = document.querySelector("#result-card");
const maturityPill = document.querySelector("#maturity-pill");
const riskPill = document.querySelector("#risk-pill");
const resultTitle = document.querySelector("#result-title");
const summaryOutput = document.querySelector("#summary-output");
const blockingOutput = document.querySelector("#blocking-output");
const nextStepOutput = document.querySelector("#next-step-output");
const copyButton = document.querySelector("#copy-button");

let currentStep = 0;

function setStep(stepIndex) {
  currentStep = stepIndex;

  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === stepIndex);
  });

  panels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === stepIndex);
  });

  progressText.textContent = `Passo ${stepIndex + 1} de ${panels.length}`;
  progressBar.style.width = `${((stepIndex + 1) / panels.length) * 100}%`;

  backButton.disabled = stepIndex === 0;
  nextButton.classList.toggle("is-hidden", stepIndex === panels.length - 1);
  submitButton.classList.toggle("is-hidden", stepIndex !== panels.length - 1);
}

function getValue(name) {
  return form.elements[name].value.trim();
}

function listFrom(values) {
  return values.filter(Boolean);
}

function inferMaturity(payload) {
  let score = 0;

  [
    payload.businessContext,
    payload.realGoal,
    payload.kpis,
    payload.audience,
    payload.constraints,
    payload.budget,
  ].forEach((value) => {
    if (value.length > 18) {
      score += 1;
    }
  });

  if (score <= 2) return "baixa";
  if (score <= 4) return "média";
  return "alta";
}

function inferRisk(payload) {
  const hotSignals = [
    payload.constraints,
    payload.nonNegotiable,
    payload.urgency,
    payload.resistance,
  ]
    .join(" ")
    .toLowerCase();

  if (
    hotSignals.includes("compliance") ||
    hotSignals.includes("juríd") ||
    hotSignals.includes("jurid") ||
    hotSignals.includes("prazo") ||
    hotSignals.includes("aprov")
  ) {
    return "Atenção alta";
  }

  return "Atenção moderada";
}

function buildBlockingQuestions(payload) {
  const questions = [];

  if (!payload.realGoal) {
    questions.push("Qual é o objetivo real do projeto além do formato pedido?");
  }

  if (!payload.kpis) {
    questions.push("Quais KPIs definem sucesso mínimo e sucesso excelente?");
  }

  if (!payload.audience) {
    questions.push("Quem é o público principal e qual comportamento precisa mudar?");
  }

  if (!payload.budget) {
    questions.push("Qual é a faixa de investimento confortável para a decisão certa?");
  }

  if (!payload.constraints) {
    questions.push("Quais restrições críticas podem travar conceito, produção ou aprovação?");
  }

  return questions.slice(0, 5);
}

function buildSummary(payload, maturity) {
  const brand = payload.brand || "A marca";
  const objective = payload.realGoal || "ainda não deixou claro o objetivo real";
  const context = payload.businessContext || "o contexto de negócio ainda está pouco definido";
  const audience = payload.audience || "o público principal ainda não está claramente recortado";

  return `${brand} parece buscar um projeto com função estratégica, mas o caso ainda precisa consolidar melhor a tese de negócio. Hoje, o contexto aponta que ${context}. O objetivo declarado indica ${objective}. Em paralelo, o público central sugere ${audience}. No estado atual, a maturidade do briefing é ${maturity} e o melhor uso desta interface é destravar clareza antes de abrir proposta ou arquitetura criativa.`;
}

function buildNextStep(payload, blockingQuestions) {
  if (blockingQuestions.length > 0) {
    return "Conduzir uma rodada curta de alinhamento com as perguntas bloqueadoras acima e só então abrir score e precificação.";
  }

  if (!payload.decision) {
    return "Traduzir o objetivo em uma decisão concreta de negócio para evitar que o projeto vire apenas formato.";
  }

  return "O caso já pode seguir para score e leitura financeira, com registro no Monday para governança do pipeline.";
}

function renderResult(payload) {
  const maturity = inferMaturity(payload);
  const risk = inferRisk(payload);
  const blockingQuestions = buildBlockingQuestions(payload);

  maturityPill.textContent = `Maturidade: ${maturity}`;
  riskPill.textContent = risk;
  resultTitle.textContent = payload.brand
    ? `${payload.brand} — resumo executivo`
    : "Resumo executivo";
  summaryOutput.textContent = buildSummary(payload, maturity);
  nextStepOutput.textContent = buildNextStep(payload, blockingQuestions);

  blockingOutput.innerHTML = "";
  listFrom(blockingQuestions.length ? blockingQuestions : ["Nenhuma lacuna crítica imediata. O caso já pode avançar para qualificação."]).forEach(
    (item) => {
      const li = document.createElement("li");
      li.textContent = item;
      blockingOutput.appendChild(li);
    }
  );

  resultState.classList.add("is-hidden");
  resultCard.classList.remove("is-hidden");
}

function collectPayload() {
  return {
    brand: getValue("brand"),
    businessContext: getValue("businessContext"),
    urgency: getValue("urgency"),
    realGoal: getValue("realGoal"),
    kpis: getValue("kpis"),
    decision: getValue("decision"),
    audience: getValue("audience"),
    resistance: getValue("resistance"),
    behavior: getValue("behavior"),
    timeline: getValue("timeline"),
    budget: getValue("budget"),
    constraints: getValue("constraints"),
    nonNegotiable: getValue("nonNegotiable"),
  };
}

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => setStep(index));
});

nextButton.addEventListener("click", () => {
  setStep(Math.min(currentStep + 1, panels.length - 1));
});

backButton.addEventListener("click", () => {
  setStep(Math.max(currentStep - 1, 0));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResult(collectPayload());
});

copyButton.addEventListener("click", async () => {
  if (resultCard.classList.contains("is-hidden")) return;

  const lines = [
    resultTitle.textContent,
    "",
    summaryOutput.textContent,
    "",
    "Perguntas bloqueadoras:",
    ...Array.from(blockingOutput.querySelectorAll("li")).map((li) => `- ${li.textContent}`),
    "",
    "Próximo passo:",
    nextStepOutput.textContent,
  ];

  await navigator.clipboard.writeText(lines.join("\n"));
  copyButton.textContent = "Copiado";
  window.setTimeout(() => {
    copyButton.textContent = "Copiar resumo";
  }, 1400);
});

setStep(0);
