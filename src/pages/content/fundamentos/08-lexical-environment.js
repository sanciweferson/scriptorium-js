// src/pages/content/fundamentos/08-lexical-environment.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Lexical Environment
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que é o Lexical Environment</h2>
      <p>
        Lexical Environment é a estrutura interna que o engine JavaScript usa para
        rastrear variáveis e funções durante a execução. Cada vez que um bloco de
        código é executado — uma função, um bloco <em>if</em>, um <em>for</em> —
        um novo Lexical Environment é criado.
      </p>
      <p>
        O nome "lexical" vem do fato de que esse ambiente é determinado pela
        posição do código no texto-fonte — onde você escreveu o código, não onde
        ele é chamado. Isso é fundamental para entender closures e o comportamento
        de <em>let</em> e <em>const</em>.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Estrutura do Lexical Environment</h2>
      <p>
        Todo Lexical Environment tem dois componentes:
      </p>

      <pre><code>// Representacao conceitual
LexicalEnvironment = {
  // 1. Environment Record
  //    Um registro de todas as variaveis e funcoes
  //    declaradas neste escopo
  EnvironmentRecord: {
    nome: "Ana",
    idade: 25,
    saudar: [Function],
  },

  // 2. Referencia ao escopo externo (outer)
  //    Aponta para o Lexical Environment pai
  //    Permite buscar variaveis em escopos externos
  outer: LexicalEnvironmentPai | null
  //     null apenas no escopo global
}</code></pre>

      <p>
        A referência <em>outer</em> é o que cria a cadeia de escopos — o mecanismo
        que permite uma função acessar variáveis declaradas fora dela.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">A cadeia de escopos (scope chain)</h2>
      <p>
        Quando o engine precisa resolver o valor de uma variável, ele começa pelo
        Lexical Environment atual. Se não encontrar ali, sobe para o <em>outer</em>,
        depois para o <em>outer</em> do <em>outer</em>, e assim por diante até chegar
        ao escopo global. Se não encontrar em nenhum, lança um <em>ReferenceError</em>.
      </p>

      <pre><code>const global = "global"

function externa() {
  const deExterna = "de externa"

  function interna() {
    const deInterna = "de interna"

    // O engine resolve cada variavel subindo a chain:
    console.log(deInterna)   // encontra no proprio escopo
    console.log(deExterna)   // nao encontra aqui → sobe para externa → encontra
    console.log(global)      // nao encontra aqui → sobe → sobe → encontra no global
    console.log(inexistente) // nao encontra em nenhum nivel → ReferenceError
  }

  interna()
}

externa()</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Lexical scope vs. dynamic scope</h2>
      <p>
        JavaScript usa lexical scope — o escopo de uma variável é determinado
        por onde ela foi declarada no código, não por onde a função é chamada.
        Isso é diferente de dynamic scope, onde o escopo dependeria da pilha
        de chamadas em tempo de execução.
      </p>

      <pre><code>const x = "global"

function lerX() {
  // Qual valor de x esta funcao ve?
  // Lexical scope: o x do ambiente onde lerX foi DEFINIDA — o escopo global
  // Dynamic scope (nao e o JS): o x do ambiente de quem CHAMOU lerX
  console.log(x)
}

function executar() {
  const x = "local de executar"
  lerX()  // imprime "global", nao "local de executar"
  //        porque lerX foi definida no escopo global,
  //        nao dentro de executar
}

executar()  // "global"</code></pre>

      <p>
        Esse comportamento é previsível e consistente — você consegue saber o
        valor de uma variável só de olhar para o código, sem precisar saber o
        histórico de chamadas em tempo de execução.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">let e const no Lexical Environment</h2>
      <p>
        Diferente de <em>var</em>, que é registrada no Variable Environment e
        sofre hoisting com valor <em>undefined</em>, variáveis declaradas com
        <em>let</em> e <em>const</em> também são registradas no Lexical Environment
        durante a fase de criação — mas ficam em um estado chamado
        <strong>Temporal Dead Zone (TDZ)</strong> até a linha de declaração ser
        executada.
      </p>

      <pre><code>// var — hoisting completo, valor undefined
console.log(a)  // undefined (sem erro)
var a = 10
console.log(a)  // 10


// let — TDZ: existe mas nao pode ser acessada ainda
console.log(b)  // ReferenceError: Cannot access 'b' before initialization
let b = 20
console.log(b)  // 20


// const — mesma regra do let
console.log(c)  // ReferenceError: Cannot access 'c' before initialization
const c = 30</code></pre>

      <p>
        A TDZ existe para tornar erros de ordem de declaração explícitos em vez
        de silenciosos. Se você tenta usar uma variável <em>let</em> antes de
        declará-la, o erro aparece imediatamente — em vez de um <em>undefined</em>
        misterioso que poderia causar bugs difíceis de rastrear.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Escopo de bloco</h2>
      <p>
        <em>let</em> e <em>const</em> têm escopo de bloco — um novo Lexical
        Environment é criado para cada par de chaves <em>{}</em>. Isso significa
        que variáveis declaradas dentro de um <em>if</em>, <em>for</em> ou qualquer
        bloco não vazam para fora.
      </p>

      <pre><code>// var nao tem escopo de bloco — vaza para a funcao
function comVar() {
  if (true) {
    var x = 10
  }
  console.log(x)  // 10 — x vazou do bloco if
}

// let tem escopo de bloco — fica contida
function comLet() {
  if (true) {
    let y = 20
  }
  console.log(y)  // ReferenceError: y is not defined
}

// Caso classico: var em loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Imprime: 3, 3, 3 — todas as callbacks compartilham o mesmo i

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100)
}
// Imprime: 0, 1, 2 — cada iteracao tem seu proprio j (novo Lexical Environment)</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">A base das closures</h2>
      <p>
        O Lexical Environment é o mecanismo por trás das closures. Quando uma
        função é criada, ela recebe uma referência ao Lexical Environment onde
        foi definida. Mesmo depois que a função externa retorna e seu contexto
        sai da call stack, o Lexical Environment continua existindo em memória
        enquanto houver funções referenciando-o.
      </p>

      <pre><code>function criarContador() {
  let count = 0  // vive no Lexical Environment de criarContador

  return function incrementar() {
    count++       // incrementar tem referencia ao LE de criarContador
    return count
  }
}

const contador = criarContador()
// criarContador retornou — seu contexto saiu da call stack
// mas o Lexical Environment com "count" ainda existe
// porque incrementar tem referencia a ele

console.log(contador())  // 1
console.log(contador())  // 2
console.log(contador())  // 3</code></pre>

      <p>
        Isso é uma closure: a função <em>incrementar</em> "fecha sobre" o
        Lexical Environment de <em>criarContador</em>, mantendo acesso a
        <em>count</em> mesmo após o retorno da função externa. Closures têm
        sua própria aula no módulo de Escopo.
      </p>
    </section>

  `;
}