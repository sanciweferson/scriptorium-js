// src/pages/content/fundamentos/04-erros-e-console.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Erros e o Console DevTools
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O console é sua primeira ferramenta</h2>
      <p>
        Todo browser moderno tem um DevTools embutido. Para abrir, pressione
        <strong>F12</strong> no Windows/Linux ou <strong>Cmd + Option + J</strong>
        no Mac. A aba Console é onde o output do seu código aparece — e também onde
        os erros são reportados.
      </p>
      <p>
        O console não é só para ver erros. É uma ferramenta interativa: você pode
        digitar JavaScript diretamente nele e ver o resultado imediatamente. É o
        ambiente mais rápido para testar uma ideia ou verificar o comportamento de
        um trecho de código.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Os métodos do console</h2>
      <p>
        O objeto <em>console</em> expõe vários métodos além do <em>log</em>. Cada um
        tem um propósito diferente e aparece de forma distinta no DevTools.
      </p>

      <pre><code>// Saída padrão — para inspecionar valores no dia a dia
console.log("valor:", 42)
console.log({ nome: "João", idade: 30 })

// Aviso — aparece em amarelo no DevTools
console.warn("Isso pode ser um problema")

// Erro — aparece em vermelho com stack trace
console.error("Algo deu errado")

// Informação — aparece com ícone de info (varia por browser)
console.info("Aplicação iniciada")

// Tabela — exibe arrays de objetos de forma legível
const usuarios = [
  { nome: "Ana", idade: 25 },
  { nome: "Pedro", idade: 31 },
]
console.table(usuarios)

// Tempo — mede quanto tempo um trecho leva para executar
console.time("operação")
// ... código a medir ...
console.timeEnd("operação") // imprime: operação: 2.45ms

// Agrupamento — organiza logs relacionados
console.group("Dados do usuário")
console.log("nome:", "Ana")
console.log("idade:", 25)
console.groupEnd()</code></pre>

      <p>
        O <em>console.table</em> é especialmente útil para inspecionar arrays de
        objetos — muito mais legível do que um <em>console.log</em> de um array
        grande. Vale experimentar no DevTools agora.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Tipos de erro em JavaScript</h2>
      <p>
        Quando o engine encontra um problema, ele lança um objeto de erro. Cada tipo
        de erro tem um nome que indica a causa — ler a mensagem com atenção economiza
        muito tempo de debugging.
      </p>

      <pre><code>// SyntaxError — código malformado, detectado no parsing
// O arquivo inteiro falha, nenhuma linha executa
const x = {   // chave sem fechar
// SyntaxError: Unexpected end of input


// ReferenceError — variável usada antes de existir
console.log(minhaVar)
// ReferenceError: minhaVar is not defined


// TypeError — operação em um tipo incompatível
const num = 42
num()
// TypeError: num is not a function

null.propriedade
// TypeError: Cannot read properties of null


// RangeError — valor fora do intervalo permitido
new Array(-1)
// RangeError: Invalid array length


// URIError — uso incorreto de funções de URI
decodeURIComponent("%")
// URIError: URI malformed</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Lendo o stack trace</h2>
      <p>
        Quando um erro acontece, o DevTools exibe um stack trace — a sequência de
        chamadas de função que levou até o erro. Lido de cima para baixo, ele mostra
        onde o erro foi lançado e por qual caminho o código chegou lá.
      </p>

      <pre><code>function c() {
  null.propriedade  // erro acontece aqui
}

function b() {
  c()
}

function a() {
  b()
}

a()

// Stack trace no console:
// TypeError: Cannot read properties of null
//   at c (app.js:2)      ← onde o erro aconteceu
//   at b (app.js:6)      ← quem chamou c
//   at a (app.js:10)     ← quem chamou b
//   at app.js:13         ← quem chamou a</code></pre>

      <p>
        O erro está na linha 2, dentro de <em>c</em>. O stack trace mostra o caminho
        completo: <em>a</em> chamou <em>b</em>, que chamou <em>c</em>, onde o erro
        aconteceu. Clicar no link do arquivo no DevTools leva direto para a linha.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">try, catch e finally</h2>
      <p>
        Para capturar erros em tempo de execução sem quebrar a aplicação, usamos
        o bloco <em>try/catch</em>. O código dentro do <em>try</em> é executado
        normalmente. Se um erro for lançado, a execução pula para o <em>catch</em>,
        que recebe o objeto de erro.
      </p>

      <pre><code>try {
  const data = JSON.parse("isso não é json válido")
} catch (erro) {
  console.error("Falha ao parsear JSON:", erro.message)
  // Falha ao parsear JSON: Unexpected token i in JSON at position 0
}

// O código continua normalmente após o catch
console.log("Execução continua aqui")</code></pre>

      <p>
        O bloco <em>finally</em> executa sempre — com ou sem erro. Útil para
        limpar recursos como conexões ou timers, independente do resultado.
      </p>

      <pre><code>function buscarDados() {
  try {
    // tentativa de operação que pode falhar
    const resultado = operacaoArriscada()
    return resultado
  } catch (erro) {
    console.error("Erro:", erro.message)
    return null
  } finally {
    // executa sempre, mesmo se houve erro ou return
    console.log("buscarDados finalizado")
  }
}</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Lançando erros com throw</h2>
      <p>
        Você pode lançar seus próprios erros com <em>throw</em>. A convenção é lançar
        instâncias de <em>Error</em> — ou suas subclasses — para manter consistência
        com os erros nativos do JS e preservar o stack trace.
      </p>

      <pre><code>function dividir(a, b) {
  if (b === 0) {
    throw new Error("Divisão por zero não é permitida")
  }
  return a / b
}

try {
  console.log(dividir(10, 2))  // 5
  console.log(dividir(10, 0))  // lança erro
} catch (erro) {
  console.error(erro.message)
  // Divisão por zero não é permitida
}</code></pre>

      <p>
        Lançar erros explícitos com mensagens descritivas torna o debugging muito
        mais fácil. Um erro genérico <em>"something went wrong"</em> não diz nada;
        um erro <em>"userId deve ser um número positivo, recebeu: -3"</em> diz tudo.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O debugger do DevTools</h2>
      <p>
        O console é útil para inspecionar valores pontuais, mas para entender o
        fluxo de execução em detalhe, o debugger é mais poderoso. A palavra-chave
        <em>debugger</em> no código funciona como um breakpoint — pausa a execução
        exatamente ali, se o DevTools estiver aberto.
      </p>

      <pre><code>function calcular(x) {
  const dobro = x * 2
  debugger  // pausa aqui quando o DevTools está aberto
  const triplo = x * 3
  return dobro + triplo
}

calcular(5)</code></pre>

      <p>
        Com a execução pausada, você pode inspecionar o valor de qualquer variável
        no escopo atual, avançar linha por linha, entrar dentro de funções chamadas
        ou pular para o próximo breakpoint. É a forma mais eficiente de entender
        o que está acontecendo em código complexo.
      </p>
      <p>
        Lembre de remover os <em>debugger</em> antes de ir para produção — eles
        pausam a execução para qualquer usuário que tiver o DevTools aberto.
      </p>
    </section>

  `;
}