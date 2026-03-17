// src/pages/content/fundamentos/09-variable-environment.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Variable Environment
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">Variable Environment vs. Lexical Environment</h2>
      <p>
        Na aula anterior vimos o Lexical Environment — a estrutura que rastreia
        variáveis de bloco (<em>let</em>, <em>const</em>) e mantém a cadeia de
        escopos. O Variable Environment é sua contraparte: é onde as declarações
        <em>var</em> e funções declaradas (<em>function declaration</em>) vivem.
      </p>
      <p>
        Na especificação do ES6 em diante, Variable Environment e Lexical Environment
        são componentes separados de um mesmo Execution Context. Na prática, a
        diferença mais importante é o comportamento do hoisting — e é isso que
        separa <em>var</em> de <em>let</em> e <em>const</em> de forma fundamental.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Hoisting de var</h2>
      <p>
        Durante a fase de criação do execution context, o engine varre o código
        em busca de declarações <em>var</em> e as registra no Variable Environment
        com valor inicial <em>undefined</em>. A atribuição do valor real só acontece
        na fase de execução, quando a linha correspondente é processada.
      </p>

      <pre><code>// O que voce escreve:
console.log(nome)  // undefined — sem erro
var nome = "Ana"
console.log(nome)  // "Ana"

// Como o engine processa (representacao conceitual):
// FASE 1 — criacao:
//   Variable Environment: { nome: undefined }
//
// FASE 2 — execucao linha por linha:
//   console.log(nome)  → nome existe, vale undefined
//   nome = "Ana"       → agora nome recebe "Ana"
//   console.log(nome)  → nome vale "Ana"</code></pre>

      <p>
        O <em>var</em> é declarado, mas não inicializado com o valor real ainda.
        Por isso o primeiro <em>console.log</em> retorna <em>undefined</em> em
        vez de lançar um <em>ReferenceError</em>.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Hoisting de function declaration</h2>
      <p>
        Funções declaradas com a sintaxe <em>function nome() {}</em> são tratadas
        de forma diferente do <em>var</em>: elas são registradas no Variable
        Environment com o valor completo da função — não apenas <em>undefined</em>.
        Isso significa que podem ser chamadas antes de aparecerem no código.
      </p>

      <pre><code>// Funciona — funcao disponivel antes da declaracao
console.log(somar(2, 3))  // 5

function somar(a, b) {
  return a + b
}

// FASE 1 — criacao:
//   Variable Environment: { somar: [Function: somar] }
//   A funcao inteira e registrada, nao apenas undefined
//
// FASE 2 — execucao:
//   console.log(somar(2, 3)) → somar ja existe e funciona</code></pre>

      <p>
        Isso é diferente de function expressions e arrow functions, que são
        atribuídas a variáveis — e portanto sofrem o hoisting do <em>var</em>
        (valor <em>undefined</em> até a linha de atribuição).
      </p>

      <pre><code>// Function expression — NAO funciona antes da declaracao
console.log(multiplicar(2, 3))  // TypeError: multiplicar is not a function

var multiplicar = function(a, b) {
  return a * b
}

// Por que TypeError e nao ReferenceError?
// multiplicar existe (var foi hoisted com undefined)
// mas undefined nao e uma funcao — dai o TypeError</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">var nao tem escopo de bloco</h2>
      <p>
        Uma consequência importante do Variable Environment é que <em>var</em>
        ignora blocos <em>{}</em>. Ao contrário de <em>let</em> e <em>const</em>,
        que criam um novo Lexical Environment por bloco, <em>var</em> pertence
        ao Variable Environment da função mais próxima — ou do escopo global
        se não estiver dentro de nenhuma função.
      </p>

      <pre><code>function exemplo() {
  if (true) {
    var x = 10      // var — pertence ao Variable Environment de exemplo()
    let y = 20      // let — pertence ao bloco if
    const z = 30    // const — pertence ao bloco if
  }

  console.log(x)  // 10 — x vazou do bloco if para a funcao
  console.log(y)  // ReferenceError: y is not defined
  console.log(z)  // ReferenceError: z is not defined
}

// var no escopo global
if (true) {
  var global = "vazei para o global"
}
console.log(global)  // "vazei para o global"
console.log(window.global)  // "vazei para o global" (no browser)</code></pre>

      <p>
        Declarar <em>var</em> dentro de um <em>if</em> ou <em>for</em> e ter
        a variável disponível fora é uma das fontes mais comuns de bugs sutis
        em código JavaScript legado.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">var em loops — o bug classico</h2>
      <p>
        O comportamento de <em>var</em> em loops com funções assíncronas é um
        dos exemplos mais citados de bug causado pelo Variable Environment.
        Como <em>var</em> não tem escopo de bloco, todas as iterações do loop
        compartilham a mesma variável.
      </p>

      <pre><code>// Bug com var
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i)
  }, 1000)
}
// Imprime: 3, 3, 3
// Por que? Quando os callbacks executam (apos 1s), o loop ja terminou
// e i vale 3. Todas as funcoes referenciam o mesmo i do Variable Environment.


// Solucao com let
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log(j)
  }, 1000)
}
// Imprime: 0, 1, 2
// Por que? let cria um novo Lexical Environment por iteracao.
// Cada callback captura seu proprio j.


// Solucao alternativa com var (pre-ES6): IIFE
for (var k = 0; k < 3; k++) {
  (function(k) {
    setTimeout(function() {
      console.log(k)
    }, 1000)
  })(k)
}
// Imprime: 0, 1, 2
// A IIFE cria um novo Variable Environment a cada iteracao,
// capturando o valor atual de k como parametro.</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Redeclaracao com var</h2>
      <p>
        O Variable Environment permite redeclarar a mesma variável com <em>var</em>
        múltiplas vezes sem erro. O Lexical Environment com <em>let</em> e
        <em>const</em> não permite isso.
      </p>

      <pre><code>// var — redeclaracao silenciosa
var usuario = "Ana"
var usuario = "Pedro"   // sem erro — simplesmente reusa a mesma variavel
console.log(usuario)    // "Pedro"


// let — redeclaracao e erro
let produto = "caneta"
let produto = "lapis"   // SyntaxError: Identifier 'produto' has already been declared


// const — redeclaracao e erro, e alem disso nao pode ser reatribuida
const PI = 3.14
PI = 3.14159            // TypeError: Assignment to constant variable
const PI = 3.14159      // SyntaxError: Identifier 'PI' has already been declared</code></pre>

      <p>
        A redeclaração silenciosa do <em>var</em> é perigosa em arquivos grandes —
        você pode redeclarar uma variável acidentalmente sem perceber, sobrescrevendo
        um valor importante. <em>let</em> e <em>const</em> tornam esse tipo de erro
        explícito.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Quando usar var hoje</h2>
      <p>
        A resposta direta: raramente. Em código moderno, <em>let</em> e <em>const</em>
        substituem <em>var</em> em praticamente todos os casos. O escopo de bloco
        é mais previsível, a TDZ torna erros explícitos, e a proibição de
        redeclaração evita bugs silenciosos.
      </p>
      <ul class="lesson__list">
        <li>
          Use <strong>const</strong> por padrão — para qualquer valor que não
          precisa ser reatribuído. Isso não significa imutabilidade do objeto,
          apenas que a variável não será apontada para outro valor.
        </li>
        <li>
          Use <strong>let</strong> quando precisar reatribuir — contadores de
          loop, variáveis acumuladoras, valores que mudam ao longo do tempo.
        </li>
        <li>
          Evite <strong>var</strong> em código novo — a não ser que esteja
          trabalhando em um contexto específico que exija compatibilidade com
          engines muito antigos, o que é raro hoje.
        </li>
      </ul>
      <p>
        Entender <em>var</em> ainda é essencial — você vai encontrá-lo em código
        legado, em tutoriais antigos e em perguntas de entrevista. Mas escrever
        código novo com <em>var</em> é escolher complexidade desnecessária.
      </p>
    </section>

  `;
}