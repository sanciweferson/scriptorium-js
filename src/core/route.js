// src/core/router.js
// ─────────────────────────────────────────────────────────────────────────────
// Responsabilidades deste módulo:
//   1. Expor `navigate(url)` — navegação programática via pushState + pipeline
//   2. Expor `router()`     — inicializa os dois listeners que capturam navegação
//
// Este módulo é o ponto de entrada do sistema de roteamento.
// Ele orquestra os outros módulos: pipeline, guards e render.
// ─────────────────────────────────────────────────────────────────────────────

// `updatePage` atualiza o <main> com o HTML da rota atual.
// Chamada após confirmar que a navegação foi aprovada pelos guards.
import { updatePage } from "@core/render";

// `runPipeline` executa os guards em sequência antes de confirmar a navegação.
import { runPipeline } from "@core/pipeline";

// Os dois guards registrados globalmente:
//   logGuard  → registra toda tentativa de navegação no console
//   authGuard → protege rotas que exigem autenticação
import { authGuard, logGuard } from "@core/guards";


// ─── GUARDS GLOBAIS ───────────────────────────────────────────────────────────
//
// Array com os guards que rodam em TODA navegação, na ordem declarada.
//
// A ordem importa — os guards executam sequencialmente:
//   1. logGuard primeiro: registra a tentativa ANTES de qualquer bloqueio.
//      Se authGuard bloqueasse antes, nunca saberíamos que a tentativa ocorreu.
//   2. authGuard segundo: decide se a navegação é permitida.
//
// Para adicionar um novo guard global (ex: analyticsGuard, roleGuard),
// basta incluí-lo neste array na posição desejada — sem tocar em mais nada.
const globalGuards = [logGuard, authGuard];


// ─────────────────────────────────────────────────────────────────────────────
// navigate(url)
//
// Função de navegação programática. Chamada quando:
//   - Um link [data-link] é clicado (pelo listener de click abaixo)
//   - Um guard redireciona para outra rota (via pipeline.js)
//   - Código da aplicação navega manualmente: navigate("/perfil")
//
// Fluxo:
//   1. Resolve `from` e `to` como pathnames normalizados
//   2. Aborta se já estamos na rota de destino (evita loop)
//   3. Roda a pipeline de guards
//   4. Se aprovado: pushState + updatePage
//   5. Se bloqueado ou redirecionado: nada acontece aqui
// ─────────────────────────────────────────────────────────────────────────────
export function navigate(url) {

  // `window.location.pathname` retorna apenas o caminho da URL atual.
  // Ex: se a URL é "https://site.com/fundamentos?x=1", pathname = "/fundamentos"
  // `from` é sempre o pathname puro — sem query string, sem hash.
  const from = window.location.pathname;

  // `new URL(url, window.location.origin)` constrói um objeto URL completo.
  //
  // Por que não usar `url` diretamente?
  // Porque `url` pode chegar em vários formatos:
  //   "/sobre"                        → path relativo — ok
  //   "https://site.com/sobre"        → URL absoluta — ok
  //   "/login?redirect=/admin"        → com query string
  //
  // `new URL(url, window.location.origin)`:
  //   O segundo argumento é a base para resolver URLs relativas.
  //   "/sobre" + "https://site.com" → "https://site.com/sobre"
  //   O resultado é sempre um objeto URL completo e normalizado.
  //
  // `.pathname` extrai só o caminho, descartando query string e hash.
  // Isso garante que os guards e o cache trabalhem com paths limpos.
  // Ex: "/login?redirect=/admin" → to = "/login" (a query é preservada na URL,
  //     mas `to` para os guards é só o pathname)
  const to = new URL(url, window.location.origin).pathname;

  // Guard clause: se já estamos na rota de destino, não fazemos nada.
  //
  // Sem essa verificação:
  //   - Clicar duas vezes no mesmo link adicionaria entradas duplicadas no histórico
  //   - `pushState` seria chamado desnecessariamente
  //   - Os guards rodariam sem motivo
  //   - `updatePage` reconstruiria o DOM com o mesmo conteúdo
  //
  // `return` sai da função imediatamente — nada abaixo executa.
  if (from === to) return;

  // Executa a pipeline de guards antes de qualquer mudança de URL ou DOM.
  //
  // Por que os guards rodam ANTES do pushState?
  //   Se um guard bloquear ou redirecionar, a URL original NÃO muda.
  //   O histórico do browser só registra navegações que foram aprovadas.
  //   Se fizéssemos pushState antes e um guard bloqueasse depois, o usuário
  //   veria a URL mudar na barra de endereços mas o conteúdo não atualizaria.
  //
  // Argumentos passados para runPipeline:
  //   globalGuards → array de guards a executar
  //   from         → pathname de origem (para os guards consultarem)
  //   to           → pathname de destino (para os guards consultarem)
  //   callback     → função executada SOMENTE se todos os guards aprovarem
  runPipeline(globalGuards, from, to, () => {

    // Todos os guards aprovaram. Agora sim confirmamos a navegação.
    //
    // history.pushState(state, title, url):
    //   Adiciona uma nova entrada no histórico do browser SEM recarregar a página.
    //   Atualiza a URL na barra de endereços imediatamente.
    //
    //   state → null: não precisamos de estado serializado no histórico.
    //           (seria útil em apps que salvam scroll position, form data, etc.)
    //   title → null: o segundo argumento foi descontinuado pelos browsers;
    //           passar null é a convenção atual.
    //   url   → a URL original passada para navigate(), não o `to` normalizado.
    //           Isso preserva query strings e hash na barra de endereços.
    history.pushState(null, null, url);

    // Atualiza o <main> com o HTML da nova rota.
    // `updatePage` lê `window.location.pathname` internamente —
    // e agora que pushState já rodou, pathname já aponta para `to`.
    updatePage();
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// router()
//
// Inicializa os dois mecanismos de captura de navegação.
// Deve ser chamada UMA vez, quando a aplicação inicializa (em app.js).
//
// Os dois casos de navegação que precisamos cobrir:
//   A) Usuário clica em um link → interceptamos com listener de "click"
//   B) Usuário clica Voltar/Avançar → interceptamos com listener de "popstate"
// ─────────────────────────────────────────────────────────────────────────────
export function router() {

  // ── A) Interceptação de cliques em links ───────────────────────────────────
  //
  // Listener global no `document` — captura cliques em qualquer elemento da página.
  // Usamos event delegation: um único listener cobre todos os links presentes
  // e futuros, sem precisar registrar listener em cada <a> individualmente.
  document.addEventListener("click", (e) => {

    // `e.target` é o elemento exato que recebeu o clique.
    // Pode ser o próprio <a>, ou um elemento filho dele (ex: <span> dentro de <a>).
    //
    // `closest("[data-link]")` sobe na árvore do DOM a partir de `e.target`
    // procurando o ancestral mais próximo (ou o próprio elemento) que tenha
    // o atributo `data-link`.
    //
    // Retorna:
    //   O elemento <a data-link> encontrado → se existir na hierarquia
    //   null → se nenhum ancestral tiver [data-link]
    //
    // Por que `closest` e não `e.target.matches("[data-link]")`?
    //   `matches` só verifica o elemento clicado, não seus ancestrais.
    //   Se o HTML for `<a data-link><span>Texto</span></a>` e o usuário
    //   clicar no <span>, `e.target` seria o <span>, não o <a>.
    //   `closest` sobe até encontrar o <a data-link> corretamente.
    const link = e.target.closest("[data-link]");

    // Guard clause: se o clique não foi em (nem dentro de) um [data-link],
    // `closest` retornou null. Não fazemos nada — deixamos o comportamento
    // padrão do browser acontecer (links externos, botões, etc.).
    if (!link) return;

    // Cancela o comportamento padrão do browser para este clique.
    // Sem isso, o <a href="..."> causaria uma requisição HTTP completa
    // e a página seria recarregada — destruindo a SPA.
    // `preventDefault()` bloqueia o reload e nos dá controle total.
    e.preventDefault();

    // Navega para o href do link usando nossa lógica de SPA.
    // `link.href` é a propriedade DOM que retorna a URL absoluta:
    //   <a href="/sobre"> → link.href = "https://site.com/sobre"
    // `navigate` sabe lidar com URLs absolutas (via `new URL` lá em cima).
    navigate(link.href);
  });


  // ── B) Botões Voltar / Avançar do navegador ────────────────────────────────
  //
  // `popstate` é disparado quando o usuário navega pelo histórico do browser:
  //   - Clica no botão "Voltar" (←)
  //   - Clica no botão "Avançar" (→)
  //   - Chama `history.back()` ou `history.forward()` via JS
  //
  // NÃO é disparado pelo `pushState` — apenas pelas navegações pelo histórico.
  //
  // Por que NÃO passa pelos guards aqui?
  //   O usuário já esteve nessa rota antes — ela já foi aprovada pelos guards
  //   quando foi visitada pela primeira vez. Não faz sentido re-validar.
  //   Além disso, redirecionar durante um "Voltar" seria uma experiência confusa.
  //
  // Por que não precisamos atualizar a URL aqui?
  //   O browser já atualizou `window.location` automaticamente ao disparar o popstate.
  //   `updatePage` só precisa ler `window.location.pathname` para saber qual
  //   rota renderizar — e ele já estará correto neste ponto.
  window.addEventListener("popstate", () => {
    updatePage();
  });
}