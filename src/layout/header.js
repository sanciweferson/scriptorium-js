// src/layout/header.js

import { menuItems } from "@components/data";
import { Logo } from "@components/logo.js";

// ─── ÍCONES ───────────────────────────────────────────────────────────────────
//
// SVGs inline em vez de arquivos externos por dois motivos:
//  1. Zero requisições extras ao servidor
//  2. `stroke: currentColor` herda a cor do elemento pai via CSS —
//     funciona automaticamente no dark mode sem precisar de duas versões

const Icons = {
  hamburger: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>`,

  close: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>`,

  moon: `<svg class="icon-moon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`,

  sun: `<svg class="icon-sun" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,

  chevron: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`
};

// ─────────────────────────────────────────────────────────────────────────────

const createLogo = (href) => /*html*/`
  <a href="${href}" data-link class="header__logo">
    ${Logo()}
  </a>`;

const createHamburgerButton = () => /*html*/`
  <button id="js-menu-toggle" type="button" class="nav__btn-toggle" aria-label="Abrir menu" aria-expanded="false">
    <span class="nav__icon--open">${Icons.hamburger}</span>
    <span class="nav__icon--close hidde">${Icons.close}</span>
  </button>`;

// ─────────────────────────────────────────────────────────────────────────────

/* Nav desktop — item simples ou com dropdown
   Itens com `sub` recebem a classe nav__item--has-dropdown
   e o atributo data-nav-item (usado pelo _buildPortalDropdowns).
   O dropdown em si é criado no <body> via portal — não aqui. */
const createNavLink = ({ href, label, sub }) => {
  if (sub && sub.length) {
    return /*html*/`
      <li class="nav__item--has-dropdown" data-nav-item>
        <a href="${href}" class="nav__link--parent">
          ${label}<span class="nav__chevron">${Icons.chevron}</span>
        </a>
      </li>`;
  }
  return /*html*/`<li data-nav-item><a href="${href}">${label}</a></li>`;
};

/* Nav mobile — mesmo dado, estrutura diferente
   Itens com `sub` ganham um botão de expandir ao lado do link.
   O submenu começa escondido e abre via _setupMobileSubmenus(). */
const createMobileNavLink = ({ href, label, sub }) => {
  // CORREÇÃO: parâmetro renomeado de `text` para `label` para ficar
  // consistente com createNavLink e com os dados do menuItems.
  if (sub && sub.length) {
    const subItems = sub.map(s =>
      /*html*/`<li class="nav__mobile-sub-item"><a href="${s.href}">${s.label}</a></li>`
    ).join("");
    return /*html*/`
      <li class="nav__mobile-item--has-sub">
        <div class="nav__mobile-parent">
          <a href="${href}">${label}</a>
          <button class="nav__mobile-toggle" aria-expanded="false" aria-label="Expandir ${label}">
            <span class="nav__mobile-chevron">${Icons.chevron}</span>
          </button>
        </div>
        <ul class="nav__mobile-sub">${subItems}</ul>
      </li>`;
  }
  return /*html*/`<li><a href="${href}">${label}</a></li>`;
};

// ─────────────────────────────────────────────────────────────────────────────

const createThemeToggle = () => /*html*/`
  <button class="nav__btn-theme" type="button" aria-label="Alternar tema">
    <span class="icon--moon">${Icons.moon}</span>
    <span class="icon--sun">${Icons.sun}</span>
  </button>`;

// ─────────────────────────────────────────────────────────────────────────────

export function Header() {
  return /*html*/`
    <header class="header">
      <nav class="header__nav">
        <div>${createLogo("/")}</div>
       <div> ${createHamburgerButton()}</div>
        <ul class="menuDesktop">
          ${menuItems.map(createNavLink).join("")}
        </ul>
        <div class="nav__theme-desktop">${createThemeToggle()}</div>
      </nav>

      <aside id="js-nav-aside" class="nav__aside">
      <div class="mobile-wrappep">
   <div class="aside_logo">   ${createLogo()}</div>
      ${createThemeToggle()}
      </div>
<ul class="menuMobile">
          ${menuItems.map(createMobileNavLink).join("")}
        </ul>
      
      </aside>
    </header>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────

/* ═══════════════════════════════════════════════════════
   PORTAL DROPDOWNS

   Problema: o nav__links-list tem overflow-x:auto para
   permitir scroll horizontal. Mas overflow:auto também
   corta elementos filhos que saem do container (como
   dropdowns). Não existe solução CSS pura para isso.

   Solução: criar cada dropdown direto no <body>, fora
   do nav. O JS calcula a posição correta usando
   getBoundingClientRect() e aplica via position:fixed.

   Fluxo:
     1. Para cada item com `sub`, cria um <ul> no body
     2. Encontra o <li> correspondente no nav
     3. No mouseenter do li → posiciona e mostra o portal
     4. No mouseleave do li ou do portal → esconde
     5. No scroll do nav → reposiciona se estiver visível
═══════════════════════════════════════════════════════ */

// CORREÇÃO: era um "método" solto sem `function` — causava erro de sintaxe
// fatal que impedia o módulo inteiro de carregar.
export function buildPortalDropdowns(headerEl) {
  // Remove portais de navegações anteriores (SPA pode recriar o header)
  document.querySelectorAll(".nav-portal-dropdown").forEach(el => el.remove());

  const navLis = Array.from(headerEl.querySelectorAll(".nav__item--has-dropdown"));

  menuItems.forEach(item => {
    if (!item.sub || !item.sub.length) return;

    // Acha o <li> no nav que corresponde a este item pelo href
    const navLi = navLis.find(li =>
      li.querySelector("a")?.getAttribute("href") === item.href
    );
    if (!navLi) return;

    // Cria o dropdown no <body> — fora de qualquer overflow
    const portal = document.createElement("ul");
    portal.className = "nav__dropdown nav-portal-dropdown";
    portal.setAttribute("role", "menu");
    portal.innerHTML =
      /*html*/`<li class="nav__dropdown-header">
        <a href="${item.href}">${item.label} — Ver tudo</a>
      </li>` +
      item.sub.map(s =>
        `<li><a href="${s.href}" class="nav__dropdown-link">${s.label}</a></li>`
      ).join("");
    document.body.appendChild(portal);

    // Calcula posição: centralizado abaixo do li pai
    const posicionar = () => {
      const rect = navLi.getBoundingClientRect();
      const dropW = 260;
      let left = rect.left + rect.width / 2 - dropW / 2;
      // Evita sair da tela pelos lados
      if (left + dropW > window.innerWidth - 8) left = window.innerWidth - dropW - 8;
      if (left < 8) left = 8;
      portal.style.left = left + "px";
      portal.style.top = rect.bottom + "px";
    };

    const mostrar = () => {
      posicionar();
      portal.classList.add("is-visible");
      navLi.querySelector(".nav__chevron").style.transform = "rotate(180deg)";
    };

    const esconder = (e) => {
      // Não esconde se o mouse foi para o próprio portal (hover contínuo)
      if (e?.relatedTarget && portal.contains(e.relatedTarget)) return;
      portal.classList.remove("is-visible");
      navLi.querySelector(".nav__chevron").style.transform = "";
    };

    navLi.addEventListener("mouseenter", mostrar);
    navLi.addEventListener("mouseleave", esconder);

    // Esconde quando o mouse sai do portal (mas não se voltou pro li)
    portal.addEventListener("mouseleave", (e) => {
      if (e.relatedTarget && navLi.contains(e.relatedTarget)) return;
      portal.classList.remove("is-visible");
      navLi.querySelector(".nav__chevron").style.transform = "";
    });

    // Reposiciona em tempo real se o nav for scrollado
    headerEl.querySelector(".nav__links-list")
      ?.addEventListener("scroll", () => {
        if (portal.classList.contains("is-visible")) posicionar();
      }, { passive: true });
  });
}

// ─────────────────────────────────────────────────────────────────────────────

/* ═══════════════════════════════════════════════════════
   MOBILE SUBMENUS

   No mobile, os submenus funcionam como acordeão:
   clicar no botão de chevron expande/colapsa a lista.
   A classe .is-open no <li> pai controla a visibilidade
   via CSS (nav__mobile-sub tem display:none por padrão).
═══════════════════════════════════════════════════════ */

// CORREÇÃO: idem — era método solto, agora é função exportada.
export function setupMobileSubmenus(headerEl) {
  headerEl.querySelectorAll(".nav__mobile-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const li = btn.closest(".nav__mobile-item--has-sub");
      const isOpen = li.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });
}