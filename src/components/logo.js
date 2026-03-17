// src/layout/logo.js

/**
 * Logo() — Componente da logo da plataforma.
 *
 * Usa <img> apontando para /public/logo.svg.
 *
 * Por que "/logo.svg" com barra no início?
 *  O Vite serve a pasta /public na raiz do servidor.
 *  "/logo.svg" = caminho absoluto a partir da raiz — funciona em qualquer rota.
 *  "logo.svg"  = caminho relativo — quebraria em rotas como /fundamentos/01-hoisting
 *  porque o browser tentaria buscar /fundamentos/logo.svg.
 */
export function Logo() {
  return /*html*/`
    <img src="/js-logo.svg" alt="JS Platform" />
  `;
}