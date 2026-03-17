// src/pages/content/variaveis-tipos/01-var.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: var
// Módulo: Variáveis & Tipos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">A origem do var</h2>
      <p>
        <em>var</em> foi a única forma de declarar variáveis em JavaScript por
        quase vinte anos — da criação da linguagem em 1995 até o ES6 em 2015,
        quando <em>let</em> e <em>const</em> foram introduzidos. Entender
        <em>var</em> não é apenas história: é entender por que <em>let</em> e
        <em>const</em> existem e o que eles corrigem.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Declaracao e atribuicao</h2>
      <p>
        Declarar uma variável é reservar um espaço na memória com um nome.
        Atribuir é colocar um valor nesse espaço. Com <em>var</em>, as duas
        operações podem acontecer juntas ou separadas.
      </p>

      <pre><code>// Declaracao sem atribuicao — valor inicial e undefined
var nome

console.log(nome)  // undefined

// Declaracao com atribuicao
var cidade = "Natal"

console.log(cidade)  // "Natal"

// Reatribuicao — var permite mudar o valor a qualquer momento
cidade = "Recife"

console.log(cidade)  // "Recife"

// Redeclaracao — var permite declarar a mesma variavel duas vezes
var cidade = "Fortaleza"  // sem erro

console.log(cidade)  // "Fortaleza"</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Escopo de funcao</h2>
      <p>
        Variáveis declaradas com <em>var</em> têm escopo de função — elas existem
        em toda a função onde foram declaradas, independente do bloco onde aparecem.
        Se declaradas fora de qualquer função, pertencem ao escopo global.
      </p>

      <pre><code>function exemplo() {
  var x = 10

  if (true) {
    var y = 20  // var ignora o bloco if — pertence a funcao
    var x = 30  // redeclara x — mesma variavel, novo valor
  }

  console.log(x)  // 30 — foi redeclarado dentro do if
  console.log(y)  // 20 — y vazou do bloco if para a funcao
}

exemplo()

console.log(x)  // ReferenceError — x nao existe fora da funcao
console.log(y)  // ReferenceError — y nao existe fora da funcao</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Hoisting de var</h2>
      <p>
        Durante a fase de criação do execution context, todas as declarações
        <em>var</em> são registradas com valor <em>undefined</em> antes de
        qualquer linha ser executada. Isso se chama hoisting.
      </p>

      <pre><code>// O que voce escreve:
console.log(produto)  // undefined — sem erro
var produto = "caneta"
console.log(produto)  // "caneta"


// Como o engine processa:
// FASE 1 — criacao: var produto = undefined (registrada no topo)
// FASE 2 — execucao:
//   console.log(produto)  → undefined
//   produto = "caneta"    → atribuicao acontece aqui
//   console.log(produto)  → "caneta"


// Apenas a declaracao e hoisted — nao a atribuicao
console.log(a + b)  // NaN (undefined + undefined = NaN)
var a = 5
var b = 10
console.log(a + b)  // 15</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">var no escopo global</h2>
      <p>
        Quando <em>var</em> é declarado fora de qualquer função, ele se torna
        uma propriedade do objeto global — <em>window</em> no browser. Isso
        significa que variáveis globais declaradas com <em>var</em> podem
        conflitar com propriedades nativas do browser acidentalmente.
      </p>

      <pre><code>var usuario = "Ana"

console.log(usuario)         // "Ana"
console.log(window.usuario)  // "Ana" — virou propriedade do window

// Perigo: sobrescrever propriedades nativas
var location = "Natal"
// window.location agora e uma string em vez do objeto de navegacao
// Isso pode quebrar links e navegacao na pagina</code></pre>

      <p>
        <em>let</em> e <em>const</em> no escopo global não se tornam propriedades
        do objeto global — ficam em um escopo separado chamado script scope.
        Mais uma razão para preferi-los.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O problema do var em loops</h2>
      <p>
        O comportamento mais problemático do <em>var</em> aparece em loops com
        funções assíncronas. Como <em>var</em> não tem escopo de bloco, todas
        as iterações compartilham a mesma variável.
      </p>

      <pre><code>// Bug classico com var
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i)  // todas imprimem 3
  }, 1000)
}
// Output: 3, 3, 3
// Quando os callbacks executam, o loop ja terminou e i e 3


// Solucao pre-ES6: IIFE captura o valor atual
for (var i = 0; i < 3; i++) {
  (function(capturedI) {
    setTimeout(function() {
      console.log(capturedI)  // 0, 1, 2
    }, 1000)
  })(i)
}

// Solucao moderna: use let
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log(j)  // 0, 1, 2
  }, 1000)
}</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Quando var ainda aparece</h2>
      <p>
        Em código moderno com módulos ES6, raramente você vai escrever <em>var</em>.
        Mas vai encontrá-lo em:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Código legado</strong> — projetos escritos antes de 2015 ou
          que nunca foram atualizados usam <em>var</em> em todo lugar.
        </li>
        <li>
          <strong>Tutoriais antigos</strong> — muito conteúdo na internet ainda
          usa <em>var</em>. Saber ler e entender esse código é importante.
        </li>
        <li>
          <strong>Entrevistas</strong> — perguntas sobre hoisting, escopo e
          closures frequentemente usam <em>var</em> para explorar casos de borda.
        </li>
      </ul>
      <p>
        Para código novo: use <em>const</em> por padrão e <em>let</em> quando
        precisar reatribuir. <em>var</em> não adiciona nada que <em>let</em>
        não faça melhor — e traz vários comportamentos que causam bugs.
      </p>
    </section>

  `;
}