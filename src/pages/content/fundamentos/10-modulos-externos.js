// src/pages/content/fundamentos/10-modulos-externos.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Scripts externos e módulos
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O problema de um arquivo só</h2>
      <p>
        Nos primeiros anos do JavaScript, era comum ter todo o código de uma
        aplicação em um único arquivo. Isso funcionava para scripts pequenos,
        mas à medida que as aplicações cresciam, o problema ficava evidente:
        tudo no escopo global, nomes em conflito, dependências implícitas e
        nenhuma forma de saber o que dependia do quê.
      </p>
      <p>
        A solução passou por várias fases — scripts externos via <em>src</em>,
        padrões como AMD e CommonJS, e finalmente os módulos ES6 nativos da
        linguagem. Entender esse histórico ajuda a entender por que o sistema
        de módulos atual funciona do jeito que funciona.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Scripts externos com src</h2>
      <p>
        A forma mais básica de organizar código em múltiplos arquivos é usando
        múltiplas tags <em>script</em> com o atributo <em>src</em>. O browser
        carrega e executa cada arquivo na ordem em que aparecem no HTML.
      </p>

      <pre><code>&lt;!-- Ordem importa — cada script tem acesso ao que foi declarado antes --&gt;
&lt;script src="utils.js"&gt;&lt;/script&gt;
&lt;script src="api.js"&gt;&lt;/script&gt;
&lt;script src="app.js"&gt;&lt;/script&gt;</code></pre>

      <p>
        O problema: tudo ainda vai para o escopo global. Se <em>utils.js</em>
        declara <em>var helper = ...</em> e <em>api.js</em> também declara
        <em>var helper = ...</em>, o segundo sobrescreve o primeiro silenciosamente.
        Em aplicações grandes, isso vira um pesadelo de manutenção.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O padrão IIFE como solução pré-módulos</h2>
      <p>
        Antes dos módulos existirem, a comunidade usava IIFEs — Immediately Invoked
        Function Expressions — para criar escopos isolados e evitar poluição do
        escopo global.
      </p>

      <pre><code>// utils.js — sem modulos, com IIFE
const Utils = (function() {
  // tudo aqui fica no escopo da funcao, nao no global
  const versao = "1.0"

  function formatar(texto) {
    return texto.trim().toLowerCase()
  }

  // apenas o que for retornado fica acessivel de fora
  return {
    formatar,
    versao,
  }
})()

// em outro arquivo:
Utils.formatar("  OLA MUNDO  ")  // "ola mundo"
// versao nao e acessivel diretamente — so via Utils.versao</code></pre>

      <p>
        Esse padrão funcionava, mas exigia disciplina manual e ainda dependia
        de variáveis globais (como <em>Utils</em> no exemplo). CommonJS e AMD
        tentaram resolver isso de forma mais sistemática, mas só os módulos
        ES6 trouxeram uma solução nativa à linguagem.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Módulos ES6 — type="module"</h2>
      <p>
        Os módulos ES6 são arquivos JavaScript com escopo próprio — variáveis
        declaradas num módulo não vazam para o escopo global. Para que o browser
        trate um script como módulo, basta adicionar <em>type="module"</em> na
        tag script.
      </p>

      <pre><code>&lt;!-- Carrega app.js como modulo ES6 --&gt;
&lt;script type="module" src="app.js"&gt;&lt;/script&gt;</code></pre>

      <p>
        Módulos têm comportamentos diferentes de scripts normais:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Escopo próprio</strong> — variáveis declaradas no módulo não
          existem no <em>window</em> global.
        </li>
        <li>
          <strong>Strict mode automático</strong> — todo módulo roda em strict
          mode, sem precisar da diretiva <em>"use strict"</em>.
        </li>
        <li>
          <strong>Defer por padrão</strong> — módulos são sempre carregados com
          comportamento equivalente ao <em>defer</em>: o HTML é processado primeiro,
          o módulo executa depois.
        </li>
        <li>
          <strong>Executado uma única vez</strong> — mesmo que importado por
          vários arquivos, um módulo é executado apenas uma vez. O resultado
          é cacheado e reutilizado.
        </li>
      </ul>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">export e import</h2>
      <p>
        Módulos comunicam entre si via <em>export</em> e <em>import</em>. Só o
        que for explicitamente exportado fica disponível para outros módulos —
        o resto permanece privado ao arquivo.
      </p>

      <pre><code>// matematica.js
export function somar(a, b) {
  return a + b
}

export function subtrair(a, b) {
  return a - b
}

const segredo = "nao exportado"  // privado — nao acessivel de fora


// app.js
import { somar, subtrair } from "./matematica.js"

console.log(somar(5, 3))      // 8
console.log(subtrair(10, 4))  // 6
console.log(segredo)          // ReferenceError — nao foi exportado</code></pre>

      <p>
        Existe também o export default — para exportar um valor principal do
        módulo. Named exports e default exports têm sintaxes diferentes. O
        módulo de Módulos ES6 mais adiante no curso cobre isso em detalhe.
      </p>

      <pre><code>// config.js — export default
export default {
  apiUrl: "https://api.exemplo.com",
  timeout: 5000,
}

// app.js — import do default nao usa chaves
import config from "./config.js"
console.log(config.apiUrl)  // "https://api.exemplo.com"</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Bundlers — Vite, Webpack e o build step</h2>
      <p>
        Em produção, raramente se entrega módulos ES6 diretamente ao browser.
        Ferramentas chamadas bundlers — como Vite e Webpack — processam o código
        antes de servir ao usuário.
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Resolução de imports</strong> — o bundler segue todos os
          <em>import</em> e constrói um grafo de dependências. Sabe exatamente
          o que depende do quê.
        </li>
        <li>
          <strong>Bundling</strong> — combina múltiplos arquivos em um (ou poucos)
          arquivos otimizados, reduzindo o número de requisições HTTP.
        </li>
        <li>
          <strong>Tree shaking</strong> — remove código que foi importado mas
          nunca usado, reduzindo o tamanho final do bundle.
        </li>
        <li>
          <strong>Transformações</strong> — converte TypeScript, JSX, CSS modules
          e outros formatos para JavaScript puro que o browser entende.
        </li>
      </ul>
      <p>
        Este projeto usa Vite. Quando você escreve <em>import</em> e <em>export</em>
        nos arquivos, o Vite resolve tudo durante o desenvolvimento e cria um bundle
        otimizado para produção. Os aliases como <em>@components</em> e <em>@pages</em>
        são configurados no Vite e não existem no JavaScript nativo — são uma
        conveniência do build tool.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">CommonJS — o sistema do Node.js</h2>
      <p>
        Antes dos módulos ES6, o Node.js adotou CommonJS como sistema de módulos.
        Você ainda vai encontrá-lo frequentemente em projetos Node, configurações
        de ferramentas e código legado.
      </p>

      <pre><code>// utils.js — CommonJS
function formatar(texto) {
  return texto.trim().toLowerCase()
}

module.exports = { formatar }
// ou: module.exports = formatar (exporta so a funcao)


// app.js — CommonJS
const { formatar } = require("./utils.js")
console.log(formatar("  OLA  "))  // "ola"


// Diferenca chave com ES6 modules:
// require() e sincrono e pode ser chamado em qualquer lugar do codigo
// import e estatico — resolvido antes da execucao, sempre no topo</code></pre>

      <p>
        Node.js suporta ambos hoje — arquivos <em>.mjs</em> ou com
        <em>"type": "module"</em> no <em>package.json</em> usam ES6 modules;
        arquivos <em>.cjs</em> ou sem a configuração usam CommonJS. Em projetos
        novos, ES6 modules é a escolha recomendada.
      </p>
    </section>

  `;
}