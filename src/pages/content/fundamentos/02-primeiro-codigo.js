// src/pages/content/fundamentos/02-primeiro-codigo.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Seu primeiro código
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">Onde o JavaScript vive</h2>
      <p>
        Antes de escrever qualquer código, é útil saber onde ele vai rodar.
        No browser, JavaScript existe dentro de uma página HTML. O browser lê o HTML,
        encontra uma referência a um arquivo JavaScript — ou um bloco de script inline —
        e passa esse código para o engine executar.
      </p>
      <p>
        Não existe um programa separado que você abre para rodar JavaScript no browser.
        O próprio browser é o ambiente de execução. Isso significa que seu código tem
        acesso a tudo que o browser expõe: a página, os eventos do usuário, a rede,
        o armazenamento local.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">A tag script</h2>
      <p>
        A forma mais direta de conectar JavaScript a uma página HTML é através da
        tag <em>script</em>. Ela pode aparecer de duas formas: com o código escrito
        diretamente dentro dela, ou com um atributo <em>src</em> apontando para um
        arquivo externo.
      </p>
      <p>
        O código inline funciona, mas tem um problema prático: mistura JavaScript
        com HTML, o que dificulta manutenção à medida que o projeto cresce. O padrão
        moderno é sempre usar arquivos separados e referenciá-los com <em>src</em>.
      </p>
      <p>
        Por padrão, quando o browser encontra uma tag <em>script</em>, ele para de
        processar o HTML, executa o script inteiro, e só então continua. Isso significa
        que um script no topo da página pode atrasar a renderização do conteúdo visível.
        Por isso, a convenção tradicional era colocar scripts antes do fechamento do
        <em>body</em> — o HTML já teria sido lido antes do script rodar.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">defer e async</h2>
      <p>
        Os atributos <em>defer</em> e <em>async</em> modificam esse comportamento
        e permitem que o browser baixe o arquivo JavaScript sem bloquear o processamento
        do HTML.
      </p>
      <ul class="lesson__list">
        <li>
          <strong>defer</strong> — O script é baixado em paralelo com o HTML,
          mas só executa depois que o HTML inteiro foi processado. A ordem de execução
          entre múltiplos scripts com <em>defer</em> é preservada. É a opção mais
          segura para scripts que precisam interagir com a página.
        </li>
        <li>
          <strong>async</strong> — O script é baixado em paralelo e executa assim
          que terminar o download, interrompendo o processamento do HTML naquele
          momento. A ordem de execução entre múltiplos scripts com <em>async</em>
          não é garantida. Útil para scripts independentes, como analytics.
        </li>
      </ul>
      <p>
        Para a maioria dos casos, <em>defer</em> é a escolha certa. Projetos modernos
        que usam bundlers como Vite ou Webpack adicionam esses atributos automaticamente
        — mas entender o que eles fazem é importante para depurar problemas de carregamento.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O console do browser</h2>
      <p>
        O console é a primeira ferramenta de um programador JavaScript. Ele permite
        ver o que seu código está produzindo, inspecionar valores, e entender o que
        está acontecendo em tempo de execução.
      </p>
      <p>
        Para abrir o console, pressione <strong>F12</strong> (ou
        <strong>Cmd + Option + J</strong> no Mac) em qualquer browser moderno.
        O painel que abre é o DevTools — uma suíte de ferramentas de desenvolvimento.
        A aba Console é onde o output do seu código aparece.
      </p>
      <p>
        <em>console.log()</em> é a forma mais básica de imprimir um valor. Você passa
        qualquer valor para ele — uma string, um número, um objeto, um array — e ele
        exibe no console. É simples, mas é uma das ferramentas mais usadas no dia a dia,
        mesmo por programadores experientes.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Seu primeiro output</h2>
      <p>
        A tradição de começar com "Hello, World" existe por um motivo: ela confirma
        que o ambiente está funcionando. Antes de escrever qualquer lógica, é importante
        saber que o código está sendo executado, que o arquivo está sendo carregado,
        e que o output está aparecendo onde você espera.
      </p>
      <p>
        No JavaScript rodando no browser, a forma mais comum de confirmar isso é com
        <em>console.log("Hello, World")</em>. Uma string entre aspas, passada para o
        console.log. O browser executa, o texto aparece no console, e você sabe que
        o ambiente está funcionando.
      </p>
      <p>
        Existe também <em>alert()</em>, que abre uma janela modal com a mensagem — mas
        ela bloqueia a execução e é invasiva. É útil para testes rápidos, mas não para
        código real. O console é sempre o lugar certo para inspecionar valores durante
        o desenvolvimento.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Ponto e vírgula</h2>
      <p>
        JavaScript tem um mecanismo chamado ASI — Automatic Semicolon Insertion.
        Em muitos casos, o engine insere ponto e vírgula automaticamente no final
        de linhas, o que significa que omiti-los nem sempre causa erro.
      </p>
      <p>
        Isso levou a uma divisão de opinião na comunidade: alguns preferem escrever
        ponto e vírgula explicitamente em todo lugar, outros confiam no ASI e omitem.
        Ambas as abordagens funcionam — o que importa é ser consistente dentro de
        um projeto.
      </p>
      <p>
        O ASI tem casos de borda onde ele se comporta de forma inesperada. Conhecer
        as regras evita surpresas. Mas no dia a dia, a maioria dos projetos modernos
        usa um formatador automático como Prettier que resolve essa questão sem que
        você precise pensar sobre ela.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Case sensitivity</h2>
      <p>
        JavaScript é case sensitive — letras maiúsculas e minúsculas são tratadas
        como caracteres diferentes. <em>nome</em>, <em>Nome</em> e <em>NOME</em>
        são três identificadores distintos para o engine.
      </p>
      <p>
        Isso afeta variáveis, funções, propriedades de objetos e palavras-chave.
        As palavras-chave da linguagem — <em>let</em>, <em>const</em>, <em>function</em>,
        <em>return</em> — são sempre minúsculas. Escrever <em>Let</em> ou
        <em>FUNCTION</em> não funciona.
      </p>
      <p>
        A convenção padrão em JavaScript é camelCase para variáveis e funções
        (<em>minhaVariavel</em>, <em>calcularTotal</em>), PascalCase para classes e
        construtores (<em>MinhaClasse</em>), e SCREAMING_SNAKE_CASE para constantes
        globais (<em>MAX_TENTATIVAS</em>). Seguir essas convenções torna o código
        mais legível para qualquer pessoa familiarizada com a linguagem.
      </p>
    </section>

  `;
}