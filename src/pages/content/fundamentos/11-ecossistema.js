// src/pages/content/fundamentos/11-ecossistema.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Ecossistema JavaScript
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">Um ecossistema enorme</h2>
      <p>
        JavaScript tem um dos ecossistemas mais ativos de qualquer linguagem.
        O npm hospeda mais de dois milhões de pacotes. Existem ferramentas para
        praticamente qualquer problema: bundlers, linters, formatadores, frameworks
        de UI, bibliotecas de testes, ORMs, e muito mais.
      </p>
      <p>
        Para quem está começando, isso pode ser esmagador. O objetivo desta aula
        não é listar tudo — é dar um mapa das categorias principais para que você
        saiba o que existe, o que cada coisa faz, e quando vai precisar de qual.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Node.js e npm</h2>
      <p>
        Node.js é o ambiente de execução JavaScript fora do browser. Ele permite
        usar JavaScript para criar servidores, scripts de linha de comando e
        ferramentas de build.
      </p>
      <p>
        npm é o gerenciador de pacotes que vem com o Node.js. Alternativas como
        Yarn e pnpm são populares, mas npm é o padrão.
      </p>

      <pre><code># Instalar uma dependencia
npm install lodash

# Instalar como dependencia de desenvolvimento
npm install --save-dev eslint

# Rodar scripts definidos no package.json
npm run dev
npm run build</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Bundlers</h2>
      <p>
        Bundlers processam o codigo-fonte com seus modulos e dependencias,
        gerando arquivos otimizados para o browser. Fazem tree-shaking,
        minificacao e divisao do codigo em chunks.
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Vite</strong> — o bundler deste projeto. Extremamente rapido
          em desenvolvimento por servir modulos ES nativos sem bundle. Em producao,
          usa Rollup por baixo.
        </li>
        <li>
          <strong>Webpack</strong> — o bundler mais usado historicamente. Muito
          configuravel, com ecossistema enorme de plugins. Dominante em projetos
          legados e grandes enterprises.
        </li>
        <li>
          <strong>Rollup</strong> — focado em bibliotecas. Produz bundles menores
          e mais limpos. O Vite usa Rollup em producao.
        </li>
        <li>
          <strong>esbuild</strong> — escrito em Go, extremamente rapido. Usado
          internamente pelo Vite para transpilacao.
        </li>
      </ul>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Linters e formatadores</h2>
      <p>
        Linters analisam o codigo em busca de problemas — erros potenciais,
        padroes problematicos, violacoes de estilo. Formatadores aplicam estilo
        consistente automaticamente.
      </p>

      <pre><code>// ESLint — linter mais popular para JavaScript
// Configuracao basica no .eslintrc:
{
  "rules": {
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "no-console": "warn"
  }
}

// Prettier — formatador de codigo
// Configuracao no .prettierrc:
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}</code></pre>

      <p>
        A combinacao ESLint + Prettier e o padrao da industria. ESLint para
        regras de qualidade, Prettier para formatacao. Configurados no editor,
        aplicam correcoes automaticamente ao salvar.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">TypeScript</h2>
      <p>
        TypeScript e um superset de JavaScript que adiciona tipagem estatica
        opcional. Codigo TypeScript e transpilado para JavaScript antes de rodar
        — o browser nunca ve TypeScript.
      </p>

      <pre><code>// JavaScript — sem tipos
function somar(a, b) {
  return a + b
}
somar("2", 3)  // "23" — bug silencioso (concatenacao de string)


// TypeScript — com tipos
function somar(a: number, b: number): number {
  return a + b
}
somar("2", 3)
// Erro em tempo de compilacao:
// Argument of type 'string' is not assignable to parameter of type 'number'</code></pre>

      <p>
        Dominar JavaScript puro primeiro e o caminho certo. TypeScript adiciona
        uma camada em cima — sem entender a base, os erros de tipo sao dificeis
        de interpretar.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Frameworks e bibliotecas de UI</h2>
      <p>
        Para construir interfaces complexas, a maioria dos projetos usa algum
        framework. Eles abstraem a manipulacao direta do DOM e oferecem modelos
        declarativos para construir UI.
      </p>
      <ul class="lesson__list">
        <li>
          <strong>React</strong> — a biblioteca mais usada no mundo para UI.
          Usa JSX e um modelo baseado em componentes e estado.
        </li>
        <li>
          <strong>Vue</strong> — framework progressivo com sintaxe de template
          mais proxima do HTML tradicional. Popular em projetos que migram de jQuery.
        </li>
        <li>
          <strong>Angular</strong> — framework completo mantido pelo Google.
          Usa TypeScript por padrao. Muito usado em enterprises.
        </li>
        <li>
          <strong>Svelte</strong> — compila componentes para JavaScript puro em
          tempo de build, sem runtime de framework no browser.
        </li>
      </ul>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Ferramentas de teste</h2>
      <ul class="lesson__list">
        <li>
          <strong>Vitest</strong> — framework de testes integrado ao Vite.
          API compativel com Jest. A escolha natural para projetos que ja usam Vite.
        </li>
        <li>
          <strong>Jest</strong> — o framework de testes mais popular. Muito
          usado com React. API intuitiva e funciona bem sem configuracao.
        </li>
        <li>
          <strong>Playwright / Cypress</strong> — testes end-to-end que abrem
          um browser real e simulam interacoes do usuario.
        </li>
      </ul>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que importa agora</h2>
      <p>
        Com tantas ferramentas, e facil cair na armadilha de ficar aprendendo
        ferramentas em vez de aprender a linguagem. A ordem certa e:
      </p>
      <ul class="lesson__list">
        <li>
          <strong>Primeiro: JavaScript solido</strong> — os modulos deste curso
          cobrem os fundamentos que todo o resto constroi em cima. Sem isso,
          qualquer framework vira magia incompreensivel.
        </li>
        <li>
          <strong>Depois: ferramentas do dia a dia</strong> — npm, Vite,
          ESLint e Prettier. Voce ja usa Vite aqui.
        </li>
        <li>
          <strong>Em paralelo ou depois: um framework de UI</strong> — React,
          Vue ou Svelte dependendo do contexto. Com JavaScript solido, aprender
          qualquer framework fica muito mais rapido.
        </li>
        <li>
          <strong>Quando fizer sentido: TypeScript</strong> — especialmente em
          projetos maiores ou em equipe.
        </li>
      </ul>
      <p>
        Este e o fim do modulo Fundamentos. Os proximos modulos mergulham fundo
        em cada area da linguagem — variaveis, funcoes, objetos, async e muito mais.
        A base que voce construiu aqui vai fazer cada um desses modulos fazer
        mais sentido.
      </p>
    </section>

  `;
}