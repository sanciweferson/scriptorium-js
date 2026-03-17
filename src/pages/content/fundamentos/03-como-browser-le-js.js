// src/pages/content/fundamentos/03-como-browser-le-js.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Como o browser interpreta JS
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O caminho do código até a execução</h2>
      <p>
        Quando o browser encontra uma tag script, ele entrega o código para o engine
        JavaScript. Mas antes de qualquer linha rodar, o engine passa por duas fases
        distintas: a fase de compilação e a fase de execução.
      </p>
      <p>
        Entender essa separação explica comportamentos que parecem estranhos à
        primeira vista — como variáveis que existem antes de serem declaradas,
        ou funções que podem ser chamadas antes de aparecerem no código.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Fase 1 — Parsing e compilação</h2>
      <p>
        O engine lê o código inteiro antes de executar qualquer coisa. Durante essa
        leitura, ele constrói uma representação interna chamada AST — Abstract Syntax
        Tree. Pense nela como um mapa da estrutura do seu código: quais funções existem,
        quais variáveis são declaradas, como os blocos se aninha.
      </p>
      <p>
        É nessa fase que erros de sintaxe são detectados. Se você escrever algo que
        o parser não consegue entender, o código inteiro falha — nenhuma linha é
        executada.
      </p>

      <pre><code>// Erro de sintaxe — detectado na fase de parsing
// Nenhuma linha desse arquivo vai rodar
function saudacao( {
  return "olá"
}
// SyntaxError: Unexpected token '{'</code></pre>

      <p>
        Também é nessa fase que o engine registra as declarações de variáveis e
        funções — o mecanismo que chamamos de hoisting. Mas isso é assunto da
        aula de Lexical Environment.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Fase 2 — Execução</h2>
      <p>
        Depois do parsing, o engine executa o código linha por linha, de cima para
        baixo. É aqui que os valores são atribuídos, as funções são chamadas e os
        efeitos colaterais acontecem.
      </p>

      <pre><code>// O engine executa de cima para baixo
const nome = "JavaScript"    // 1. atribui "JavaScript" a nome
const ano  = 1995            // 2. atribui 1995 a ano

console.log(nome + " foi criado em " + ano)
// 3. imprime: JavaScript foi criado em 1995</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O event loop em uma linha</h2>
      <p>
        JavaScript é single-threaded — ele executa uma coisa por vez. Mas o browser
        precisa lidar com eventos, timers e respostas de rede ao mesmo tempo que
        executa código. O mecanismo que torna isso possível é o event loop.
      </p>
      <p>
        A ideia central é simples: existe uma fila de tarefas. Quando a call stack
        (onde o código executa) fica vazia, o event loop pega a próxima tarefa da
        fila e a executa.
      </p>

      <pre><code>console.log("1 — síncrono")

setTimeout(() => {
  console.log("3 — assíncrono (fila de tarefas)")
}, 0)

console.log("2 — síncrono")

// Output:
// 1 — síncrono
// 2 — síncrono
// 3 — assíncrono (fila de tarefas)</code></pre>

      <p>
        Mesmo com <em>setTimeout de 0ms</em>, o callback vai para a fila e só executa
        depois que o código síncrono termina. O número no setTimeout é o tempo mínimo
        de espera, não o tempo exato de execução.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Scripts bloqueantes na prática</h2>
      <p>
        Um script pesado no thread principal bloqueia tudo — inclusive a atualização
        visual da página. O usuário vê a tela travada até o código terminar.
      </p>

      <pre><code>// Não faça isso em produção — bloqueia o thread por ~5s
const inicio = Date.now()
while (Date.now() - inicio < 5000) {
  // loop vazio travando o browser
}
console.log("Desbloqueado depois de 5 segundos")</code></pre>

      <p>
        Para operações longas, a solução é usar APIs assíncronas — fetch, setTimeout,
        Web Workers — que delegam o trabalho para fora do thread principal e usam
        callbacks ou promises para notificar quando terminam.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Conectando tudo</h2>
      <p>
        O fluxo completo de um script rodando no browser é:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Download</strong> — o browser baixa o arquivo .js do servidor
          (ou lê o inline script do HTML).
        </li>
        <li>
          <strong>Parsing</strong> — o engine lê o código, constrói a AST, registra
          declarações. Erros de sintaxe são lançados aqui.
        </li>
        <li>
          <strong>Compilação JIT</strong> — o V8 (e outros engines modernos) compila
          partes do código para bytecode otimizado em tempo real.
        </li>
        <li>
          <strong>Execução</strong> — o código roda linha por linha na call stack.
          Tarefas assíncronas entram na fila e são processadas pelo event loop.
        </li>
      </ul>

  

    </section>

  `;
}