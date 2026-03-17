// src/pages/lesson.js

import { menuItems } from "@components/data";

// ─── PROGRESSO ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "jsplatform:progress";

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function toggleLesson(href) {
  const progress = getProgress();
  if (progress[href]) {
    delete progress[href];
  } else {
    progress[href] = true;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return !!progress[href];
}

// ─── ÍCONES ───────────────────────────────────────────────────────────────────

const Icons = {
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  arrowL: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
  arrowR: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  grid: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,

  // Ícone de copiar — dois retângulos sobrepostos
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,

  // Ícone de copiado — check simples
  copied: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
};

// ─── REGISTRO DE CONTEÚDO ─────────────────────────────────────────────────────

import { content as fundamentos01 } from "@content/fundamentos/01-introducao";
import { content as fundamentos02 } from "@content/fundamentos/02-primeiro-codigo";
import { content as fundamentos03 } from "@content/fundamentos/03-como-browser-le-js";
import { content as fundamentos04 } from "@content/fundamentos/04-erros-e-console.js"
import { content as fundamentos05 } from "@content/fundamentos/05-comentarios.js"
import { content as fundamentos06 } from "@content/fundamentos/06-strict-mode.js"
import { content as fundamentos07 } from "@content/fundamentos/07-execution-context.js"
import { content as fundamentos08 } from "@content/fundamentos/08-lexical-environment.js"
import { content as fundamentos09 } from "@content/fundamentos/09-variable-environment.js"
import { content as fundamentos10 } from "@content/fundamentos/10-modulos-externos.js"
import { content as fundamentos11 } from "@content/fundamentos/11-ecossistema.js"


import { content as varTipos01 } from "@content/variaveis-tipos/01-var";

// no CONTENT_MAP:







const CONTENT_MAP = {
  "fundamentos/01-introducao": fundamentos01,
  "fundamentos/02-primeiro-codigo": fundamentos02,
  "fundamentos/03-como-browser-le-js": fundamentos03,
  "fundamentos/04-erros-e-console": fundamentos04,
  "fundamentos/05-comentarios": fundamentos05,
  "fundamentos/06-strict-mode": fundamentos06,
  "fundamentos/07-execution-context": fundamentos07,
  "fundamentos/08-lexical-environment": fundamentos08,
  "fundamentos/09-variable-environment": fundamentos09,
  "fundamentos/10-modulos-externos": fundamentos10,
  "fundamentos/11-ecossistema": fundamentos11,

  "variaveis-tipos/01-var": varTipos01,

  
};


// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getLessonContext(modulo, slug) {
  const moduleData = menuItems.find(m => m.id === modulo);
  if (!moduleData?.sub) return null;

  const href = `/${modulo}/${slug}`;
  const currentIdx = moduleData.sub.findIndex(l => l.href === href);
  if (currentIdx === -1) return null;

  return {
    moduleData,
    lesson: moduleData.sub[currentIdx],
    prev: moduleData.sub[currentIdx - 1] ?? null,
    next: moduleData.sub[currentIdx + 1] ?? null,
    position: currentIdx + 1,
    total: moduleData.sub.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Lesson({ modulo, slug })
// ─────────────────────────────────────────────────────────────────────────────

export function Lesson({ modulo, slug }) {
  const progress = getProgress();
  const ctx = getLessonContext(modulo, slug);

  if (!ctx) {
    return /*html*/`
      <div class="lesson lesson--not-found">
        <p>Aula <strong>${modulo}/${slug}</strong> não encontrada.</p>
        <a href="/${modulo}" data-link>← Voltar ao módulo</a>
      </div>`;
  }

  const { moduleData, lesson, prev, next, position, total } = ctx;
  const isDone = !!progress[lesson.href];
  const contentFn = CONTENT_MAP[`${modulo}/${slug}`];

  return /*html*/`
    <div class="lesson">

      <!-- ── Barra de topo ── -->
      <div class="lesson__topbar lesson__anim-item">
        <nav class="lesson__breadcrumb" aria-label="Breadcrumb">
          <a href="/" data-link>Início</a>
          <span class="lesson__breadcrumb-sep">/</span>
          <a href="/${modulo}" data-link>${moduleData.label}</a>
          <span class="lesson__breadcrumb-sep">/</span>
          <span>${position < 10 ? "0" + position : position}</span>
        </nav>
        <span class="lesson__position">${position} de ${total}</span>
      </div>

      <!-- ── Cabeçalho ── -->
      <header class="lesson__header lesson__anim-item">
        <h1 class="lesson__title">${lesson.label.replace(/^\d+ — /, "")}</h1>
        <button
          id="js-lesson-toggle"
          class="lesson__btn-done ${isDone ? "lesson__btn-done--active" : ""}"
          type="button"
          data-href="${lesson.href}"
          aria-pressed="${isDone}">
          <span class="lesson__btn-done-icon">${Icons.check}</span>
          <span class="lesson__btn-done-label">${isDone ? "Concluída" : "Marcar como concluída"}</span>
        </button>
      </header>

      <!-- ── Conteúdo ── -->
      <article class="lesson__content lesson__anim-item">
        ${contentFn
      ? contentFn()
      : /*html*/`<p class="lesson__no-content">Conteúdo em breve.</p>`
    }
      </article>

      <!-- ── Navegação prev/next ── -->
      <nav class="lesson__nav lesson__anim-item" aria-label="Navegação entre aulas">
        <div class="lesson__nav-prev">
          ${prev ? /*html*/`
            <a href="${prev.href}" data-link class="lesson__nav-link lesson__nav-link--prev">
              ${Icons.arrowL}
              <span>
                <small>Anterior</small>
                ${prev.label.replace(/^\d+ — /, "")}
              </span>
            </a>` : ""}
        </div>
        <a href="/${modulo}" data-link class="lesson__nav-module" aria-label="Ver todas as aulas">
          ${Icons.grid}
        </a>
        <div class="lesson__nav-next">
          ${next ? /*html*/`
            <a href="${next.href}" data-link class="lesson__nav-link lesson__nav-link--next">
              <span>
                <small>Próxima</small>
                ${next.label.replace(/^\d+ — /, "")}
              </span>
              ${Icons.arrowR}
            </a>` : ""}
        </div>
      </nav>

    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// initLesson()
// ─────────────────────────────────────────────────────────────────────────────

export function initLesson() {

  // ── Animação de entrada ────────────────────────────────────────────────────
  requestAnimationFrame(() => {
    document.querySelectorAll(".lesson__anim-item").forEach((el, i) => {
      el.style.animationDelay = `${i * 0.08}s`;
      el.classList.add("lesson__anim-run");
    });
  });

  // ── Botão de marcar como concluída ────────────────────────────────────────
  const btn = document.getElementById("js-lesson-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const href = btn.dataset.href;
      const isDone = toggleLesson(href);
      const label = btn.querySelector(".lesson__btn-done-label");
      btn.classList.toggle("lesson__btn-done--active", isDone);
      btn.setAttribute("aria-pressed", String(isDone));
      if (label) label.textContent = isDone ? "Concluída" : "Marcar como concluída";
    });
  }
  // ── Botões de copiar código (Dinâmico) ──────────────────────────────────────
  document.querySelectorAll(".lesson__content pre").forEach(pre => {
    // Garante que o pre tenha posição relativa para o botão absoluto
    pre.style.position = "relative";

    // Cria o botão
    const copyBtn = document.createElement("button");
    copyBtn.className = "lesson__copy-btn";
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copiar código");

    // Template inicial
    const renderBtn = (icon, label) => {
      copyBtn.innerHTML = `
      <span class="lesson__copy-icon">${icon}</span>
      <span class="lesson__copy-label">${label}</span>
    `;
    };

    renderBtn(Icons.copy, "Copiar");

    copyBtn.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      const text = code ? code.textContent : pre.textContent;

      try {
        await navigator.clipboard.writeText(text);

        // Estado de sucesso
        copyBtn.classList.add("lesson__copy-btn--copied");
        renderBtn(Icons.copied, "Copiado!");

        setTimeout(() => {
          copyBtn.classList.remove("lesson__copy-btn--copied");
          renderBtn(Icons.copy, "Copiar");
        }, 2000);
      } catch (err) {
        console.error("Falha ao copiar:", err);
        copyBtn.querySelector(".lesson__copy-label").textContent = "Erro!";
      }
    });

    pre.appendChild(copyBtn);
  });}