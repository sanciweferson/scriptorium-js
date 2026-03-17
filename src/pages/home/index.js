// src/pages/home.js

import { menuItems } from "@components/data";

const STORAGE_KEY = "jsplatform:progress";
const modules = menuItems.filter(item => item.sub && item.sub.length);
const TOTAL_LESSONS = modules.reduce((acc, m) => acc + m.sub.length, 0);

const MESSAGES = [
  "Pronto para ir fundo em JavaScript?",
  "Cada aula te deixa mais perto do próximo nível.",
  "Consistência bate talento todo dia.",
  "O melhor momento para estudar é agora.",
  "Código bom começa com entendimento real.",
  "Entender é diferente de decorar.",
  "O motor do JS não tem segredos pra você.",
];

// ─── PROGRESSO ────────────────────────────────────────────────────────────────

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function countCompleted(module, progress) {
  return module.sub.filter(lesson => progress[lesson.href]).length;
}

// ─── DATA E HORA ──────────────────────────────────────────────────────────────

function formatDate(date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// ─── RENDERIZAÇÃO ─────────────────────────────────────────────────────────────

const createProgressBar = (percent) => /*html*/`
  <div class="home__progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
    <div class="home__progress-fill" style="width: ${percent}%"></div>
  </div>`;

const createModuleCard = (module, progress) => {
  const total = module.sub.length;
  const completed = countCompleted(module, progress);
  const percent = Math.round((completed / total) * 100);
  const done = completed === total;

  return /*html*/`
    <article class="home__module-card ${done ? "home__module-card--done" : ""}">
      <div class="home__module-card-header">
        <h3 class="home__module-title">
          <a href="${module.href}" data-link>${module.label}</a>
        </h3>
        <span class="home__module-count">${completed}/${total}</span>
      </div>
      ${createProgressBar(percent)}
    </article>`;
};

const createStats = (progress) => {
  const completed = modules.reduce((acc, m) => acc + countCompleted(m, progress), 0);
  const percent = Math.round((completed / TOTAL_LESSONS) * 100);

  return /*html*/`
    <section class="home__stats">
      <div class="home__stat">
        <span class="home__stat-value">${TOTAL_LESSONS}</span>
        <span class="home__stat-label">aulas no total</span>
      </div>
      <div class="home__stat">
        <span class="home__stat-value">${completed}</span>
        <span class="home__stat-label">concluídas</span>
      </div>
      <div class="home__stat">
        <span class="home__stat-value">${TOTAL_LESSONS - completed}</span>
        <span class="home__stat-label">restantes</span>
      </div>
      <div class="home__stat home__stat--highlight">
        <span class="home__stat-value">${percent}%</span>
        <span class="home__stat-label">progresso geral</span>
      </div>
    </section>`;
};

// ─── MODAL DE CONFIRMAÇÃO ─────────────────────────────────────────────────────
//
// Renderizado no <body> via portal — fora do fluxo do conteúdo.
// Controlado por showResetModal() e hideResetModal().

const createModal = () => /*html*/`
  <div id="js-reset-modal" class="home-modal" role="dialog" aria-modal="true" aria-labelledby="js-modal-title">

    <!-- Overlay — clique fora fecha -->
    <div class="home-modal__overlay" id="js-modal-overlay"></div>

    <!-- Painel do modal -->
    <div class="home-modal__panel">

      <!-- Ícone de aviso -->
      <div class="home-modal__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      <h2 class="home-modal__title" id="js-modal-title">Resetar progresso</h2>
      <p class="home-modal__body">
        Todo o progresso registrado será apagado permanentemente.
        Essa ação não pode ser desfeita.
      </p>

      <div class="home-modal__actions">
        <button id="js-modal-cancel" class="home-modal__btn home-modal__btn--cancel" type="button">
          Cancelar
        </button>
        <button id="js-modal-confirm" class="home-modal__btn home-modal__btn--confirm" type="button">
          Sim, resetar
        </button>
      </div>
    </div>
  </div>`;

// ─────────────────────────────────────────────────────────────────────────────
// Home()
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const progress = getProgress();
  const now = new Date();

  return /*html*/`
    <div class="home">

      <section class="home__hero">
        <div class="home__hero-text">
          <p class="home__greeting home__anim-item">${getGreeting()} 👋</p>
          <h1 id="js-home-headline" class="home__headline home__anim-item">${MESSAGES[0]}</h1>
          <p class="home__subline home__anim-item">
            ${TOTAL_LESSONS} aulas cobrindo do motor à aplicação —
            sem atalhos, sem mágica, com contexto real.
          </p>
        </div>
        <div class="home__clock home__anim-item" aria-live="polite" aria-atomic="true">
          <time id="js-home-time" class="home__clock-time">${formatTime(now)}</time>
          <span id="js-home-date" class="home__clock-date">${formatDate(now)}</span>
        </div>
      </section>

      ${createStats(progress)}

      <section class="home__modules">
        <div class="home__section-header">
          <h2 class="home__section-title">Progresso por módulo</h2>
          <button id="js-home-reset" class="home__btn-reset" type="button">
            Resetar progresso
          </button>
        </div>
        <div class="home__module-grid">
          ${modules.map(m => createModuleCard(m, progress)).join("")}
        </div>
      </section>

    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// initHome()
// ─────────────────────────────────────────────────────────────────────────────

export function initHome() {

  // ── Animação de entrada ────────────────────────────────────────────────────
  requestAnimationFrame(() => {
    document.querySelectorAll(".home__anim-item").forEach((el, i) => {
      el.style.animationDelay = `${i * 0.12}s`;
      el.classList.add("home__anim-run");
    });
  });

  // ── Relógio ao vivo ────────────────────────────────────────────────────────
  const timeEl = document.getElementById("js-home-time");
  const dateEl = document.getElementById("js-home-date");

  const tick = () => {
    const now = new Date();
    if (timeEl) timeEl.textContent = formatTime(now);
    if (dateEl) dateEl.textContent = formatDate(now);
  };

  const clockInterval = setInterval(tick, 1000);

  // ── Mensagens rotativas ────────────────────────────────────────────────────
  const MESSAGES_INTERVAL = 4000;
  const FADE_DURATION = 420;
  const headlineEl = document.getElementById("js-home-headline");
  let messageIndex = 0;

  const messageInterval = setInterval(() => {
    if (!headlineEl) return;
    headlineEl.classList.add("home__headline--fade");
    setTimeout(() => {
      messageIndex = (messageIndex + 1) % MESSAGES.length;
      headlineEl.textContent = MESSAGES[messageIndex];
      headlineEl.classList.remove("home__headline--fade");
    }, FADE_DURATION);
  }, MESSAGES_INTERVAL);

  // ── Modal de reset ─────────────────────────────────────────────────────────
  //
  // O modal é inserido no <body> via portal para ficar acima de tudo.
  // Abre com animação fade+scale, fecha ao clicar no overlay ou no botão Cancelar.
  // Ao confirmar: reseta o progresso e re-renderiza a home.

  const resetBtn = document.getElementById("js-home-reset");

  // Insere o HTML do modal no body (portal)
  const modalWrapper = document.createElement("div");
  modalWrapper.innerHTML = createModal();
  document.body.appendChild(modalWrapper);

  const modal = document.getElementById("js-reset-modal");
  const overlay = document.getElementById("js-modal-overlay");
  const cancelBtn = document.getElementById("js-modal-cancel");
  const confirmBtn = document.getElementById("js-modal-confirm");

  const openModal = () => {
    modal.classList.add("home-modal--open");
    // Foco no botão cancelar por padrão (mais seguro)
    setTimeout(() => cancelBtn?.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove("home-modal--open");
    resetBtn?.focus(); // devolve foco ao botão que abriu
  };

  if (resetBtn) resetBtn.addEventListener("click", openModal);
  if (overlay) overlay.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Fecha com Escape
  const onKeydown = (e) => {
    if (e.key === "Escape" && modal.classList.contains("home-modal--open")) {
      closeModal();
    }
  };
  document.addEventListener("keydown", onKeydown);

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      resetProgress();
      closeModal();
      // Re-renderiza a home via popstate
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────
  return function cleanup() {
    clearInterval(clockInterval);
    clearInterval(messageInterval);
    document.removeEventListener("keydown", onKeydown);
    // Remove o modal do body ao sair da rota
    if (modalWrapper.parentNode) modalWrapper.parentNode.removeChild(modalWrapper);
  };
}