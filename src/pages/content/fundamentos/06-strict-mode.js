// src/pages/content/fundamentos/06-strict-mode.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Strict Mode
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O problema que o strict mode resolve</h2>
      <p>
        JavaScript foi criado rapidamente e carrega decisões de design que hoje
        consideraríamos erros. Para não quebrar código antigo, essas decisões nunca
        puderam ser revertidas — a linguagem precisava manter retrocompatibilidade.
      </p>
      <p>
        O strict mode é a solução para isso. Introduzido no ES5, ele ativa uma
        versão mais rigorosa do JavaScript que proíbe comportamentos problemáticos
        e lança erros onde antes o engine simplesmente ignorava o problema silenciosamente.
        É um opt-in — você escolhe ativá-lo.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Como ativar</h2>
      <p>
        A diretiva <em>"use strict"</em> é uma string literal colocada no início
        de um arquivo ou de uma função. O engine a reconhece e ativa o modo estrito
        para aquele escopo.
      </p>

      <pre><code>// Ativa para o arquivo inteiro — deve ser a primeira linha
"use strict"

function minhaFuncao() {
  // roda em strict mode
}


// Ativa só para uma função específica
function outraFuncao() {
  "use strict"
  // só aqui é strict mode
}

function semStrictMode() {
  // aqui não é strict mode
}</code></pre>

      <p>
        Quando usado no nível do arquivo, todas as funções dentro dele também rodam
        em strict mode. Não é possível desativar o strict mode dentro de um escopo
        onde ele já foi ativado.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Módulos ES6 são strict por padrão</h2>
      <p>
        Se você usa módulos ES6 — arquivos com <em>import</em> e <em>export</em> —
        o strict mode está ativo automaticamente, sem precisar da diretiva. Projetos
        modernos com Vite, Webpack ou qualquer bundler trabalham com módulos, então
        na prática você já está em strict mode o tempo todo.
      </p>
      <p>
        Mesmo assim, vale entender o que o strict mode faz — porque você vai
        encontrar código legado sem módulos, e porque entender as restrições
        ajuda a entender por que certas coisas não funcionam da forma que você
        esperaria no modo não-estrito.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que o strict mode proíbe</h2>
      <p>
        O strict mode transforma vários comportamentos silenciosos em erros explícitos.
        Os mais importantes:
      </p>

      <pre><code>// 1. Variáveis não declaradas
"use strict"

nome = "Ana"  // ReferenceError: nome is not defined
// No modo não-estrito, isso criaria uma variável global silenciosamente


// 2. Deletar variáveis, funções ou parâmetros
"use strict"

const x = 1
delete x  // SyntaxError: Delete of an unqualified identifier in strict mode


// 3. Parâmetros duplicados em funções
"use strict"

function soma(a, a) {  // SyntaxError: Duplicate parameter name not allowed
  return a + a
}


// 4. Propriedades duplicadas em objetos literais (ES5 strict)
"use strict"

const obj = { x: 1, x: 2 }  // SyntaxError em ES5 strict
// (ES6+ permite sobrescrever, então isso não lança erro em engines modernos)


// 5. Atribuição a propriedades somente-leitura
"use strict"

const obj = {}
Object.defineProperty(obj, "id", { value: 1, writable: false })
obj.id = 2  // TypeError: Cannot assign to read only property 'id'
// No modo não-estrito, a atribuição seria silenciosamente ignorada


// 6. Uso de palavras reservadas como identificadores
"use strict"

const let = 1      // SyntaxError
const static = 2   // SyntaxError</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">this no strict mode</h2>
      <p>
        Uma das mudanças mais importantes do strict mode envolve o valor de
        <em>this</em> em funções chamadas sem um contexto explícito.
      </p>
      <p>
        No modo não-estrito, chamar uma função normal sem um objeto à esquerda
        faz o <em>this</em> apontar para o objeto global — <em>window</em> no
        browser. Isso é uma fonte enorme de bugs acidentais, porque modificações
        em <em>this</em> acabam modificando variáveis globais sem intenção.
      </p>

      <pre><code>// Modo não-estrito
function mostrarThis() {
  console.log(this)
}
mostrarThis()  // window (no browser) — perigoso


// Strict mode
"use strict"

function mostrarThisStrict() {
  console.log(this)
}
mostrarThisStrict()  // undefined — comportamento correto e previsível


// O mesmo vale para funções chamadas como callbacks
"use strict"

function Contador() {
  this.valor = 0

  setTimeout(function() {
    // this é undefined aqui em strict mode
    // (em vez de window, que causaria bug silencioso)
    console.log(this)  // undefined
  }, 100)
}</code></pre>

      <p>
        Isso é uma das razões pelas quais arrow functions foram introduzidas no ES6 —
        elas não têm próprio <em>this</em> e herdam do escopo onde foram criadas,
        evitando esse problema completamente. Mais sobre isso na aula de <em>this e Contexto</em>.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Por que isso importa hoje</h2>
      <p>
        Em projetos modernos você raramente vai escrever <em>"use strict"</em>
        manualmente — módulos ES6 já cuidam disso. Mas entender o strict mode
        é importante por três razões:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Código legado</strong> — você vai encontrar código antigo sem
          módulos onde o strict mode não está ativo. Saber a diferença evita
          surpresas ao depurar comportamentos inesperados.
        </li>
        <li>
          <strong>Entrevistas e fundamentos</strong> — perguntas sobre hoisting,
          <em>this</em> e variáveis globais acidentais frequentemente têm respostas
          diferentes dependendo do modo. Saber disso faz diferença.
        </li>
        <li>
          <strong>Entender o engine</strong> — o strict mode revela como o JavaScript
          realmente funciona por baixo, sem as camadas de compatibilidade que mascaram
          comportamentos problemáticos.
        </li>
      </ul>
    </section>

  `;
}