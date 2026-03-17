// src/pages/modulo.js
// ─────────────────────────────────────────────────────────────────────────────
// Página de visão geral de um módulo.
// Genérica — funciona para todos os 11 módulos sem alteração.
//
// Recebe `params.modulo` (ex: "fundamentos") via router e encontra
// o módulo correspondente no menuItems.
//
// Exibe:
//   - Cabeçalho do módulo (título + descrição + progresso geral)
//   - Lista de aulas com status (concluída / em andamento / pendente)
//   - Botão de navegar para a próxima aula não concluída
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── ÍCONES ───────────────────────────────────────────────────────────────────

const Icons = {
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  circle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>`,
  play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
};

// ─── DESCRIÇÕES DOS MÓDULOS ───────────────────────────────────────────────────
//
// Textos curtos exibidos no cabeçalho da página de cada módulo.
// Chave = id do módulo em menuItems.

const MODULE_DESCRIPTIONS = {
  "fundamentos": "Base do ambiente, motor e contexto de execução. O que acontece antes do seu código rodar.",
  "variaveis-tipos": "Como o JS armazena e interpreta dados. O que é um valor e como a linguagem o vê.",
  "funcoes": "Funções são cidadãs de primeira classe. O que exatamente uma função é e como ela se comporta.",
  "objetos": "A estrutura fundamental de dados em JS. Como a linguagem organiza informações relacionadas.",
  "arrays-iteracao": "Coleções ordenadas e o modelo funcional de iteração. Como o JS processa listas de dados.",
  "escopo-closures": "Como o JS resolve nomes de variáveis e preserva memória. Por que funções lembram de onde foram criadas.",
  "this-contexto": "O mecanismo mais confuso do JS, explicado do zero. A quem `this` se refere em cada contexto.",
  "prototipos-classes": "A herança real do JS antes e depois do açúcar sintático. Como objetos herdam comportamento.",
  "async": "O modelo de concorrência do JS de callbacks até async/await. Como lidar com operações assíncronas.",
  "dom-eventos": "A ponte entre JS e o que o usuário vê. Como manipular a página e reagir a interações.",
  "modulos-es6": "O sistema oficial de módulos da linguagem. Como JS organiza código em múltiplos arquivos.",
};

// ─── RENDERIZAÇÃO ─────────────────────────────────────────────────────────────

const createLessonItem = (lesson, index, progress) => {
  const done = !!progress[lesson.href];
  const number = String(index + 1).padStart(2, "0");

  return /*html*/`
    <li class="modulo__lesson-item ${done ? "modulo__lesson-item--done" : ""}">
      <a href="${lesson.href}" data-link class="modulo__lesson-link">
        <span class="modulo__lesson-icon ${done ? "modulo__lesson-icon--done" : ""}">
          ${done ? Icons.check : Icons.circle}
        </span>
        <span class="modulo__lesson-number">${number}</span>
        <span class="modulo__lesson-label">${lesson.label.replace(/^\d+ — /, "")}</span>
      </a>
    </li>`;
};

// ─────────────────────────────────────────────────────────────────────────────
// ModulePage({ modulo })
//
// `modulo` é o id do módulo (ex: "fundamentos") extraído da URL pelo router.
// ─────────────────────────────────────────────────────────────────────────────

export function ModulePage({ modulo }) {
  const progress = getProgress();

  // Encontra o módulo pelo id
  const moduleData = menuItems.find(m => m.id === modulo);

  // Guard: módulo não encontrado
  if (!moduleData || !moduleData.sub) {
    return /*html*/`
      <div class="modulo modulo--not-found">
        <p>Módulo <strong>${modulo}</strong> não encontrado.</p>
        <a href="/" data-link>← Voltar para o início</a>
      </div>`;
  }

  const total = moduleData.sub.length;
  const completed = moduleData.sub.filter(l => progress[l.href]).length;
  const percent = Math.round((completed / total) * 100);

  // Próxima aula não concluída (para o botão "Continuar")
  const nextLesson = moduleData.sub.find(l => !progress[l.href]);

  return /*html*/`
    <div class="modulo">

      <!-- ── Cabeçalho ── -->
      <header class="modulo__header modulo__anim-item">
        <div class="modulo__header-text">
          <a href="/" data-link class="modulo__breadcrumb">← Início</a>
          <h1 class="modulo__title">${moduleData.label}</h1>
          <p class="modulo__description">${MODULE_DESCRIPTIONS[modulo] ?? ""}</p>
        </div>

        <!-- Card de progresso do módulo -->
        <div class="modulo__progress-card modulo__anim-item">
          <div class="modulo__progress-numbers">
            <span class="modulo__progress-value">${completed}<span class="modulo__progress-total">/${total}</span></span>
            <span class="modulo__progress-label">aulas concluídas</span>
          </div>
          <div class="modulo__progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
            <div class="modulo__progress-fill" style="width: ${percent}%"></div>
          </div>
          <span class="modulo__progress-percent">${percent}%</span>
        </div>
      </header>

      <!-- ── Botão continuar (só aparece se houver aula não concluída) ── -->
      ${nextLesson ? /*html*/`
        <div class="modulo__continue modulo__anim-item">
          <a href="${nextLesson.href}" data-link class="modulo__btn-continue">
            ${completed === 0 ? "Começar módulo" : "Continuar de onde parei"}
            ${Icons.arrow}
          </a>
        </div>` : /*html*/`
        <div class="modulo__continue modulo__anim-item">
          <span class="modulo__badge-done">✓ Módulo concluído</span>
        </div>`
    }

      <!-- ── Lista de aulas ── -->
      <section class="modulo__lessons modulo__anim-item">
        <h2 class="modulo__lessons-title">Aulas</h2>
        <ul class="modulo__lesson-list">
          ${moduleData.sub.map((lesson, i) => createLessonItem(lesson, i, progress)).join("")}
        </ul>
      </section>

    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// initModulePage()
//
// Anima a entrada dos elementos após o DOM estar pronto.
// Retorna cleanup (vazio — sem timers nesta página).
// ─────────────────────────────────────────────────────────────────────────────

export function initModulePage() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".modulo__anim-item").forEach((el, i) => {
      el.style.animationDelay = `${i * 0.08}s`;
      el.classList.add("modulo__anim-run");
    });
  });

  return function cleanup() { };
}