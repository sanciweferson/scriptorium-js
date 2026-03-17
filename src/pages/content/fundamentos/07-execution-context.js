// src/pages/content/fundamentos/07-execution-context.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Execution Context
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que é um execution context</h2>
      <p>
        Execution context — ou contexto de execução — é o ambiente criado pelo
        engine JavaScript toda vez que código vai ser executado. Ele contém tudo
        que o engine precisa para rodar aquele trecho de código: quais variáveis
        existem, qual é o valor de <em>this</em>, e qual código está sendo executado.
      </p>
      <p>
        Pense no execution context como uma caixa. Quando o engine precisa executar
        código, ele cria uma caixa com tudo que esse código vai precisar, empilha
        essa caixa no topo da call stack, e começa a executar. Quando termina,
        a caixa é descartada.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Tipos de execution context</h2>
      <p>
        Existem três tipos de execution context em JavaScript:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Global Execution Context</strong> — criado quando o script começa
          a rodar. Existe apenas um por programa. No browser, o objeto global é
          <em>window</em>; no Node.js, é <em>global</em>. O <em>this</em> no nível
          global aponta para esse objeto.
        </li>
        <li>
          <strong>Function Execution Context</strong> — criado toda vez que uma
          função é chamada. Cada chamada cria um novo contexto, mesmo que seja a
          mesma função sendo chamada várias vezes. Funções recursivas empilham
          múltiplos contextos da mesma função.
        </li>
        <li>
          <strong>Eval Execution Context</strong> — criado quando código é executado
          via <em>eval()</em>. Raro e desencorajado — <em>eval</em> tem implicações
          de segurança e performance sérias.
        </li>
      </ul>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que um execution context contém</h2>
      <p>
        Cada execution context tem três componentes principais:
      </p>

      <pre><code>// Representação conceitual de um execution context
ExecutionContext = {
  // 1. Variable Environment
  //    Onde var e funções são registradas (fase de criação)
  VariableEnvironment: { ... },

  // 2. Lexical Environment
  //    Onde let, const e referências ao escopo externo vivem
  LexicalEnvironment: { ... },

  // 3. This Binding
  //    O valor de "this" dentro deste contexto
  //    Depende de como a função foi chamada
  ThisBinding: window | undefined | objeto | ...
}</code></pre>

      <p>
        Variable Environment e Lexical Environment são conceitos próximos — a
        diferença principal é como lidam com <em>var</em> vs. <em>let/const</em>
        e com hoisting. Cada um tem sua própria aula.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">A call stack</h2>
      <p>
        A call stack é a estrutura onde os execution contexts são empilhados.
        Funciona como uma pilha de pratos — o último que entrou é o primeiro
        que sai (LIFO: Last In, First Out).
      </p>
      <p>
        Quando o script começa, o Global Execution Context entra na pilha.
        Cada chamada de função empilha um novo contexto. Quando a função retorna,
        seu contexto é retirado da pilha e a execução volta para o contexto anterior.
      </p>

      <pre><code>function somar(a, b) {
  return a + b
}

function calcular() {
  const resultado = somar(3, 5)
  console.log(resultado)
}

calcular()

// Estado da call stack durante a execução:
//
// Passo 1:  [ Global | calcular ]
// Passo 2:  [ Global | calcular | somar ]
// Passo 3:  somar executa e retorna 8
// Passo 4:  [ Global | calcular ]
// Passo 5:  calcular termina
// Passo 6:  [ Global ]</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Fases de um execution context</h2>
      <p>
        Cada execution context passa por duas fases antes e durante a execução:
      </p>

      <pre><code>function exemplo() {
  console.log(x)    // undefined — nao e ReferenceError
  console.log(fn)   // [Function: fn] — funcao disponivel antes da declaracao

  var x = 10
  console.log(x)    // 10

  function fn() {
    return "ola"
  }
}

exemplo()

// Por que isso acontece?
//
// FASE 1 — Criacao (antes de executar qualquer linha):
//   O engine varre o codigo e registra:
//   - var x  → criada com valor undefined
//   - function fn → criada com o valor da funcao completa
//
// FASE 2 — Execucao (linha por linha):
//   - console.log(x)  → x existe (undefined), sem erro
//   - console.log(fn) → fn existe (funcao completa)
//   - x = 10          → agora x recebe 10
//   - console.log(x)  → x e 10</code></pre>

      <p>
        Esse comportamento — variáveis e funções sendo registradas antes da
        execução — é o hoisting. O nome vem da ideia de que as declarações são
        "içadas" para o topo do contexto. Na prática, elas não se movem no código;
        o engine simplesmente as processa antes de começar a executar.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Stack overflow</h2>
      <p>
        A call stack tem tamanho limitado. Se funções continuarem se chamando
        recursivamente sem uma condição de parada, a pilha fica cheia e o engine
        lança um erro.
      </p>

      <pre><code>// Recursao infinita — estoura a call stack
function infinita() {
  return infinita()
}

infinita()
// RangeError: Maximum call stack size exceeded


// Recursao com condicao de parada — funciona corretamente
function contarAte(n) {
  if (n <= 0) return
  console.log(n)
  contarAte(n - 1)
}

contarAte(5)
// 5, 4, 3, 2, 1</code></pre>

      <p>
        O erro "Maximum call stack size exceeded" é um dos mais comuns em JavaScript.
        Quando você o vê, o primeiro lugar para olhar é se existe alguma função
        chamando a si mesma — direta ou indiretamente — sem uma condição de parada.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Por que isso importa</h2>
      <p>
        Entender o execution context não é conhecimento teórico sem uso prático.
        Ele explica diretamente:
      </p>
      <ul class="lesson__list">
        <li>
          Por que <em>var</em> se comporta diferente de <em>let</em> e <em>const</em>
          — são registradas em partes diferentes do contexto.
        </li>
        <li>
          Por que funções declaradas podem ser chamadas antes de aparecerem no
          código — são registradas completas na fase de criação.
        </li>
        <li>
          Por que <em>this</em> muda dependendo de como a função é chamada —
          o this binding é definido na criação do contexto, não na definição da função.
        </li>
        <li>
          Por que closures funcionam — funções guardam referência ao contexto
          onde foram criadas, mesmo depois que esse contexto saiu da call stack.
        </li>
      </ul>
      <p>
        Cada um desses tópicos tem sua própria aula. O execution context é o fio
        que os conecta todos.
      </p>
    </section>

  `;
}