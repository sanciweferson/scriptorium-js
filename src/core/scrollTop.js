// javascript

// src/core/scrollTop.js
// ─────────────────────────────────────────────────────────────────────────────
// Botão flutuante de volta ao topo com indicador de porcentagem de scroll.
//
// Estrutura:
//   - Um anel SVG animado (stroke-dashoffset) mostra o progresso visual
//   - O número no centro exibe a % atual
//   - Aparece só quando o usuário scrollou mais de 10% da página
//   - Clique: scroll suave até o topo
//
// Uso:
//   import { initScrollTop } from "@core/scrollTop";
//   // retorna cleanup — chame ao sair da rota
//   const cleanup = initScrollTop();
// ─────────────────────────────────────────────────────────────────────────────

const BTN_ID = "js-scroll-top";

// Cria o HTML do botão e insere no <body> (portal)
function createBtn() {
  if (document.getElementById(BTN_ID)) return; // já existe

  // Configurações do anel SVG
  // O círculo tem r=18, então circunferência = 2π×18 ≈ 113.1
  const RADIUS = 18;
  const CIRCUM = +(2 * Math.PI * RADIUS).toFixed(2); // 113.1

  const btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Voltar ao topo");
  btn.setAttribute("type", "button");

  btn.innerHTML = /*html*/`
    <svg class="scroll-top__ring" viewBox="0 0 44 44" aria-hidden="true">
      <!-- Trilha de fundo -->
      <circle
        class="scroll-top__track"
        cx="22" cy="22" r="${RADIUS}"
        fill="none"
        stroke-width="2.5"
      />
      <!-- Arco de progresso -->
      <circle
        class="scroll-top__arc"
        cx="22" cy="22" r="${RADIUS}"
        fill="none"
        stroke-width="2.5"
        stroke-dasharray="${CIRCUM}"
        stroke-dashoffset="${CIRCUM}"
        stroke-linecap="round"
        transform="rotate(-90 22 22)"
      />
    </svg>

    <!-- Porcentagem no centro -->
    <span class="scroll-top__pct" aria-hidden="true">0%</span>

    <!-- Seta para cima (visível quando está no topo: 0%) -->
    <span class="scroll-top__arrow" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </span>
  `;

  document.body.appendChild(btn);
  return btn;
}

// ─────────────────────────────────────────────────────────────────────────────
// initScrollTop()
// ─────────────────────────────────────────────────────────────────────────────

export function initScrollTop() {
  const RADIUS = 18;
  const CIRCUM = +(2 * Math.PI * RADIUS).toFixed(2);

  const btn = createBtn();
  if (!btn) return () => { };

  const arc = btn.querySelector(".scroll-top__arc");
  const pct = btn.querySelector(".scroll-top__pct");
  const arrow = btn.querySelector(".scroll-top__arrow");

  // ── Atualiza o progresso no scroll ────────────────────────────────────────
  const onScroll = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.round((scrolled / total) * 100) : 0;

    // Atualiza o arco SVG
    const offset = CIRCUM - (percent / 100) * CIRCUM;
    arc.style.strokeDashoffset = offset;

    // Atualiza o texto e alterna entre % e seta
    if (percent <= 2) {
      pct.style.display = "none";
      arrow.style.display = "flex";
    } else {
      pct.textContent = percent + "%";
      pct.style.display = "block";
      arrow.style.display = "none";
    }

    // Mostra o botão só depois de 10% de scroll
    btn.classList.toggle("scroll-top--visible", percent > 10);
  };

  // ── Scroll suave ao topo ───────────────────────────────────────────────────
  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", onClick);

  // Roda uma vez para estado inicial correto
  onScroll();

  // ── Cleanup ────────────────────────────────────────────────────────────────
  return function cleanup() {
    window.removeEventListener("scroll", onScroll);
    btn.removeEventListener("click", onClick);
    // Remove o botão do DOM ao sair da rota
    if (btn.parentNode) btn.parentNode.removeChild(btn);
  };
}