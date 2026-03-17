import { Layout } from "@layout/index";
import { renderPage, initPage } from "@core/render";
import { router } from "@core/route";
import { initMenu } from "./mobile/menuEvents";
import { initTheme } from "./theme/theme.init";
import { buildPortalDropdowns, setupMobileSubmenus } from "@layout/header";
import { initScrollTop } from "@core/scrollTop"; // ← adiciona

export function App() {
  router();
  initMenu();
  initTheme();

  const pageContent = renderPage();

  requestAnimationFrame(() => {
    const headerEl = document.querySelector(".header");
    if (!headerEl) return;

    buildPortalDropdowns(headerEl);
    setupMobileSubmenus(headerEl);
    initPage(window.location.pathname);
    initScrollTop(); // ← adiciona
  });

  return Layout({ children: pageContent });
}