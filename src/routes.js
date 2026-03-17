// src/routes.js
// ─────────────────────────────────────────────────────────────────────────────
// Tabela de rotas da aplicação.
//
// Cada rota tem:
//   path      → padrão de URL (segmentos com : são parâmetros dinâmicos)
//   component → função que recebe params e retorna HTML como string
//
// Ordem importa: o matchRoute() para na primeira rota que bater.
// Rotas mais específicas devem vir antes das mais genéricas.
// O wildcard "*" é tratado como fallback no próprio matchRoute().
// ─────────────────────────────────────────────────────────────────────────────

import { Home } from "./pages/home/index";
import { ModulePage } from "@pages/modulo.js";
import { Lesson } from "@pages/lesson.js";

export const routes = [

  // ── Home ──────────────────────────────────────────────────────────────────
  {
    path: "/",
    component: Home,
  },

  // ── Páginas de módulo ─────────────────────────────────────────────────────
  //
  // Cada módulo tem sua própria URL (/fundamentos, /funcoes, etc.).
  // O componente ModulePage recebe { modulo: "fundamentos" } e encontra
  // os dados no menuItems pelo id.
  //
  // Por que rotas estáticas em vez de uma rota dinâmica /:modulo?
  //   Uma rota /:modulo bateria em QUALQUER pathname de um segmento,
  //   incluindo rotas que não existem. Registrar cada módulo explicitamente
  //   garante que só URLs válidas chegam ao ModulePage.
  {
    path: "/fundamentos",
    component: () => ModulePage({ modulo: "fundamentos" }),
  },
  {
    path: "/variaveis-tipos",
    component: () => ModulePage({ modulo: "variaveis-tipos" }),
  },
  {
    path: "/funcoes",
    component: () => ModulePage({ modulo: "funcoes" }),
  },
  {
    path: "/objetos",
    component: () => ModulePage({ modulo: "objetos" }),
  },
  {
    path: "/arrays-iteracao",
    component: () => ModulePage({ modulo: "arrays-iteracao" }),
  },
  {
    path: "/escopo-closures",
    component: () => ModulePage({ modulo: "escopo-closures" }),
  },
  {
    path: "/this-contexto",
    component: () => ModulePage({ modulo: "this-contexto" }),
  },
  {
    path: "/prototipos-classes",
    component: () => ModulePage({ modulo: "prototipos-classes" }),
  },
  {
    path: "/async",
    component: () => ModulePage({ modulo: "async" }),
  },
  {
    path: "/dom-eventos",
    component: () => ModulePage({ modulo: "dom-eventos" }),
  },
  {
    path: "/modulos-es6",
    component: () => ModulePage({ modulo: "modulos-es6" }),
  },

  // ── Aulas ─────────────────────────────────────────────────────────────────
  //
  // Rota dinâmica que cobre TODAS as aulas de todos os módulos.
  // Exemplo: /fundamentos/01-introducao → params = { modulo: "fundamentos", slug: "01-introducao" }
  //
  // Deve vir DEPOIS das rotas de módulo para não interceptá-las.
  // Ex: sem isso, /fundamentos bateria aqui com modulo="fundamentos" e slug=undefined.
  {
    path: "/:modulo/:slug",
    component: Lesson,
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: "*",
    component: () => /*html*/`
      <section style="text-align: center; padding: 4rem 2rem;">
        <h1>404 — Página não encontrada</h1>
        <p>O endereço <strong>${window.location.pathname}</strong> não existe.</p>
        <a href="/" data-link>← Voltar para o início</a>
      </section>
    `,
  },

];