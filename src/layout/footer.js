// src/layout/footer.js
// ─────────────────────────────────────────────────────────────────────────────
// Responsabilidade deste módulo:
//   Gerar o HTML estático do rodapé da aplicação.
//   Não tem comportamentos JS — só markup e dados.
//
// Estrutura do footer:
//   1. Topo   → Logo + descrição da plataforma + redes sociais
//   2. Meio   → Colunas de links agrupados por categoria (módulos)
//   3. Base   → Copyright + links legais
// ─────────────────────────────────────────────────────────────────────────────

import { menuItems } from "@components/data";
import { Logo } from "@components/logo.js";

// ─── ÍCONES ───────────────────────────────────────────────────────────────────
//
// SVGs inline — zero requisições extras, stroke:currentColor herda a cor do CSS.

const Icons = {
  github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>`,

  twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4l11.733 16H20L8.267 4z"/>
    <path d="M4 20 15.33 8h.67"/>
    <path d="M20 4 8.67 16H8"/>
  </svg>`,

  youtube: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>`,

  rss: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 11a9 9 0 0 1 9 9"/>
    <path d="M4 4a16 16 0 0 1 16 16"/>
    <circle cx="5" cy="19" r="1"/>
  </svg>`,
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
</svg>`,
};

// ─── DADOS DO FOOTER ──────────────────────────────────────────────────────────
//
// Os módulos do menuItems são divididos em duas colunas de links.
// `home` é filtrado — não faz sentido como categoria no footer.
// Dividimos os módulos ao meio para criar duas colunas equilibradas.

const modules = menuItems.filter(item => item.id !== "home");

// Divide o array de módulos em dois grupos para as duas colunas de nav
const halfway = Math.ceil(modules.length / 2);
const colA = modules.slice(0, halfway);   // Ex: Fundamentos → this & Contexto
const colB = modules.slice(halfway);      // Ex: Protótipos → Módulos ES6

// Links legais da barra inferior
const legalLinks = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de uso" },
  { href: "/cookies", label: "Cookies" },
];

// Redes sociais
const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: Icons.github },
  { href: "https://twitter.com", label: "Twitter", icon: Icons.twitter },
  { href: "https://youtube.com", label: "YouTube", icon: Icons.youtube },
  { href: "/rss.xml", label: "RSS", icon: Icons.rss },
  { href: "https://instagram.com/seuperfil", label: "Instagram", icon: Icons.instagram },
];

// ─── FUNÇÕES DE RENDERIZAÇÃO ──────────────────────────────────────────────────

// Coluna de links de módulos
// `items` é um slice do array `modules`
const createNavColumn = (items) => /*html*/`
  <ul class="footer__nav-list">
    ${items.map(item => /*html*/`
      <li>
        <a href="${item.href}" data-link class="footer__nav-link">
          ${item.label}
        </a>
      </li>
    `).join("")}
  </ul>`;

// Ícones de redes sociais
const createSocialLinks = () => /*html*/`
  <div class="footer__social">
    ${socialLinks.map(s => /*html*/`
      <a href="${s.href}"
         class="footer__social-link"
         aria-label="${s.label}"
         target="_blank"
         rel="noopener noreferrer">
        ${s.icon}
      </a>
    `).join("")}
  </div>`;

// Barra inferior: copyright + links legais
const createBottomBar = () => {
  const year = new Date().getFullYear();
  return /*html*/`
    <div class="footer__bottom">
      <p class="footer__copyright">
        © ${year} JS Platform. Feito com dedicação para devs que querem ir fundo.
      </p>
      <nav class="footer__legal" aria-label="Links legais">
        ${legalLinks.map(l => /*html*/`
          <a href="${l.href}" data-link class="footer__legal-link">${l.label}</a>
        `).join("")}
      </nav>
    </div>`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Footer()
//
// Função principal — retorna o HTML completo do rodapé como string.
// Chamada pelo Layout() em src/layout/index.js.
// ─────────────────────────────────────────────────────────────────────────────

export function Footer() {
  return /*html*/`
    <footer class="footer">
      <div class="footer__inner">

        <!-- ── Bloco de identidade: logo + descrição + social ── -->
        <div class="footer__brand">
          <a href="/" data-link class="footer__logo">
            ${Logo()}
          </a>
          <p class="footer__tagline">
            Uma plataforma para aprender JavaScript do jeito certo —
            do motor à aplicação, sem atalhos.
          </p>
          ${createSocialLinks()}
        </div>

        <!-- ── Colunas de navegação por módulo ── -->
        <nav class="footer__nav" aria-label="Módulos do curso">
          <div class="footer__nav-group">
            <h3 class="footer__nav-heading">Módulos</h3>
            ${createNavColumn(colA)}
          </div>
          <div class="footer__nav-group">
            <!--
              O heading vazio mantém o alinhamento vertical das duas colunas.
              aria-hidden evita que leitores de tela anunciem um título vazio.
            -->
            <h3 class="footer__nav-heading" aria-hidden="true">&nbsp;</h3>
            ${createNavColumn(colB)}
          </div>
        </nav>

      </div>

      <!-- ── Barra inferior ── -->
      ${createBottomBar()}
    </footer>
  `;
}