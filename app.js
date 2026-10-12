"use strict";

const editor = document.querySelector("#editor");
const results = document.querySelector("#results");
const status = document.querySelector("#status");
const wordCount = document.querySelector("#word-count");
const checkButton = document.querySelector("#check-button");
const improveButton = document.querySelector("#improve-button");
const clearButton = document.querySelector("#clear-button");
const exampleButton = document.querySelector("#example-button");
const themeToggle = document.querySelector("#theme-toggle");
const themeColor = document.querySelector("#theme-color");

let findings = [];
let hasReviewed = false;

function applyTheme(theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Activar modo ${isDark ? "claro" : "oscuro"}`);
  themeToggle.title = `Activar modo ${isDark ? "claro" : "oscuro"}`;
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-label").textContent = `Modo ${isDark ? "claro" : "oscuro"}`;
  themeColor.content = isDark ? "#171923" : "#f6f7fb";

  if (persist) {
    try {
      localStorage.setItem("clear-english-theme", isDark ? "dark" : "light");
    } catch {
      status.textContent = "El tema cambiará, pero el navegador no permite guardar la preferencia.";
    }
  }
}

function updateWordCount() {
  const count = (editor.value.trim().match(/\b[\w'-]+\b/g) || []).length;
  wordCount.textContent = `${count} ${count === 1 ? "palabra" : "palabras"}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function renderFindings() {
  if (findings.length === 0) {
    const checkedText = hasReviewed && editor.value.trim();
    results.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">✓</span>
        <h2>${checkedText ? "No se encontraron sugerencias" : "Las sugerencias aparecerán aquí"}</h2>
        <p>${checkedText ? "El texto no activó ninguna de las reglas disponibles." : "Pega un texto en inglés y selecciona «Mejorar y reemplazar texto»."}</p>
      </div>`;
    return;
  }

  const counts = findings.reduce((summary, finding) => {
    summary[finding.category] = (summary[finding.category] || 0) + 1;
    return summary;
  }, {});
  status.textContent = `${findings.length} ${
    findings.length === 1 ? "sugerencia" : "sugerencias"
  } · ${Object.entries(counts)
    .map(([category, count]) => `${count} ${category.toLowerCase()}`)
    .join(" · ")}`;

  results.innerHTML = findings.map((finding, index) => {
    const severityLabel = {
      error: "Revisar",
      warning: "Sugerencia",
      style: "Estilo",
    }[finding.severity];
    const replacement = finding.actionable
      ? `<p class="replacement"><span aria-hidden="true">→</span> ${escapeHtml(finding.suggestion)}</p>`
      : "";
    const applyButton = finding.actionable
      ? `<button class="apply-one" type="button" data-index="${index}">Aplicar</button>`
      : "";

    return `
      <article class="finding-card severity-${finding.severity}">
        <div class="finding-topline">
          <span class="category">${escapeHtml(finding.category)}</span>
          <span class="severity-label">${severityLabel}</span>
        </div>
        <p class="original">${escapeHtml(finding.original)}</p>
        ${replacement}
        <p class="explanation">${escapeHtml(finding.message)}</p>
        ${applyButton}
      </article>`;
  }).join("");
}

function reviewText() {
  const text = editor.value;
  hasReviewed = true;
  findings = window.InternationalEnglishChecker.check(text);
  status.textContent = "";
  renderFindings();
  if (findings.length === 0 && text.trim()) {
    status.textContent = "Revisión terminada";
  }
}

checkButton.addEventListener("click", reviewText);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});
improveButton.addEventListener("click", () => {
  if (!editor.value.trim()) {
    status.textContent = "Escribe o pega un texto antes de mejorarlo.";
    editor.focus();
    return;
  }

  editor.value = window.InternationalEnglishChecker.improveText(editor.value);
  updateWordCount();
  reviewText();
  editor.focus();
  status.textContent = findings.length
    ? `Texto mejorado y reemplazado en el cuadro. Queda${findings.length === 1 ? "" : "n"} ${findings.length} observaci${findings.length === 1 ? "ón opcional" : "ones opcionales"}.`
    : "Texto mejorado y reemplazado en el cuadro.";
});
editor.addEventListener("input", () => {
  updateWordCount();
  findings = [];
  hasReviewed = false;
  status.textContent = "El texto cambió. Vuelve a revisarlo para actualizar las sugerencias.";
  renderFindings();
});

results.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (!button) return;

  const selected = findings[Number(button.dataset.index)];
  if (!selected) return;
  editor.value =
    editor.value.slice(0, selected.start) +
    selected.suggestion +
    editor.value.slice(selected.end);
  updateWordCount();
  reviewText();
});

clearButton.addEventListener("click", () => {
  editor.value = "";
  findings = [];
  hasReviewed = false;
  status.textContent = "";
  updateWordCount();
  renderFindings();
  editor.focus();
});

exampleButton.addEventListener("click", () => {
  editor.value = window.InternationalEnglishExamples.fallarborWoods;
  findings = [];
  hasReviewed = false;
  status.textContent = "Ejemplo cargado. Selecciona «Mejorar y reemplazar texto».";
  updateWordCount();
  renderFindings();
  editor.focus();
});

updateWordCount();
renderFindings();
applyTheme(document.documentElement.dataset.theme || "light", false);
