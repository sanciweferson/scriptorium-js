// src/main.js
// ─────────────────────────────────────────────────────────────────────────────
// Ponto de entrada da aplicação — o primeiro arquivo executado pelo Vite.
//
// Responsabilidades:
//   1. Importar os estilos globais (Vite processa e injeta no <head>)
//   2. Chamar App() para inicializar a aplicação e obter o HTML inicial
//   3. Injetar esse HTML no elemento raiz do index.html (#app)
//
// Este arquivo é intencionalmente mínimo — nenhuma lógica vive aqui.
// Ele só conecta o index.html ao sistema da aplicação.
// ─────────────────────────────────────────────────────────────────────────────

// Importa o CSS global.
// O Vite detecta a extensão .css e processa o arquivo automaticamente:
//   - Em desenvolvimento: injeta um <style> no <head> via JS (HMR)
//   - Em produção (build): extrai para um arquivo .css separado e adiciona
//     <link rel="stylesheet"> no index.html gerado
// Não há valor de retorno — o import é feito pelo efeito colateral de injeção.
import "./styles/main.css";
// Importa a função principal da aplicação.
// App() orquestra: router, renderPage, initHeader e Layout.
// Named import — app.js exporta com `export function App`.
import { App } from "./core/app";

// Seleciona o elemento raiz definido no index.html: <div id="app"></div>
// querySelector retorna o primeiro elemento que bate no seletor CSS "#app",
// ou null se não existir.
//
// .innerHTML = App():
//   1. App() é chamado — inicializa o router, renderiza a página atual,
//      agenda o initHeader() e retorna a string HTML completa
//   2. Essa string é atribuída ao innerHTML do #app, montando todo o DOM
//      da aplicação de uma vez: header + main (com conteúdo da rota) + footer
//
// Por que innerHTML e não insertAdjacentHTML ou appendChild?
//   O #app começa vazio no index.html — não há conteúdo anterior para preservar.
//   innerHTML é direto e suficiente para a carga inicial.
//   Em navegações subsequentes, só o <main> é atualizado (via updatePage),
//   nunca o #app inteiro — então innerHTML aqui é chamado apenas uma vez.
document.querySelector("#app").innerHTML = App();