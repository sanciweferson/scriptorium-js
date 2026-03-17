// src/content/fundamentos/01-introducao.js

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que é JavaScript?</h2>
      <p>
        JavaScript é uma linguagem de programação criada em 1995 por Brendan Eich
        enquanto trabalhava na Netscape. O objetivo original era simples: permitir
        que páginas web respondessem a ações do usuário sem precisar recarregar a
        página inteira no servidor.
      </p>
      <p>
        O que começou como um script de dez dias se tornou a linguagem mais usada
        do mundo. Hoje ela roda em browsers, servidores, dispositivos móveis,
        televisões e até microcontroladores. Mas entender onde ela nasceu ajuda a
        entender por que ela funciona do jeito que funciona — inclusive as partes
        confusas.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Uma linguagem interpretada</h2>
      <p>
        Diferente de linguagens como C ou Go, JavaScript não é compilado antes de
        rodar. O código é lido e executado diretamente pelo ambiente — o browser
        ou o Node.js — em tempo real.
      </p>
      <p>
        Engines modernos, como o V8, utilizam uma técnica chamada JIT (Just-In-Time),
        que compila o código durante a execução para melhorar a performance.
        Mas do ponto de vista do programador, você escreve e o código roda —
        sem etapa de compilação manual.
      </p>
      <p>
        Isso tem uma consequência importante: muitos erros só aparecem em tempo de
        execução. Por isso entender o ambiente não é detalhe avançado — é base.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Onde JavaScript roda?</h2>

      <div class="lesson__cards">
        <div class="lesson__card">
          <div class="lesson__card-icon">🌐</div>
          <h3>Browser</h3>
          <p>
            Chrome, Firefox e outros navegadores possuem engines JavaScript embutidos.
            Aqui você tem acesso ao DOM, eventos, fetch e outras APIs da web.
          </p>
        </div>

        <div class="lesson__card">
          <div class="lesson__card-icon">🖥️</div>
          <h3>Node.js</h3>
          <p>
            Ambiente que permite executar JavaScript fora do navegador,
            com acesso a sistema de arquivos, rede e processos.
          </p>
        </div>

        <div class="lesson__card">
          <div class="lesson__card-icon">📱</div>
          <h3>Mobile</h3>
          <p>
            Com ferramentas como React Native, é possível criar apps móveis usando JavaScript.
          </p>
        </div>

        <div class="lesson__card">
          <div class="lesson__card-icon">🧩</div>
          <h3>Outros ambientes</h3>
          <p>
            JavaScript também roda em desktops, servidores edge e até dispositivos embarcados.
          </p>
        </div>
      </div>

      <p>
        Essa distinção é essencial: a linguagem é a mesma, mas cada ambiente fornece
        APIs diferentes.
      </p>

      <p>
        🌐 No browser, você encontra objetos como <em>document</em> e <em>window</em>.<br>
        🖥️ No Node.js, você trabalha com <em>fs</em>, <em>process</em> e outros recursos do sistema.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">JavaScript e ECMAScript</h2>
      <p>
        ECMAScript é a especificação que define como JavaScript funciona.
        Ela é mantida pela ECMA International.
      </p>
      <p>
        Quando você vê termos como ES6 ou ES2015, está vendo versões dessa
        especificação. Essa versão trouxe mudanças importantes como
        <code>let</code>, <code>const</code>, arrow functions e módulos.
      </p>
      <p>
        O nome JavaScript é uma marca registrada, por isso a especificação usa
        o nome ECMAScript. Mas na prática, usamos JavaScript no dia a dia.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Por que aprender JavaScript do zero?</h2>
      <p>
        Muitos cursos ensinam JavaScript mostrando apenas o que o código faz,
        sem explicar por que ele funciona assim.
      </p>
      <p>
        Isso cria um conhecimento superficial: você consegue copiar exemplos,
        mas tem dificuldade quando algo sai do esperado.
      </p>
      <p>
        Aqui, o foco é diferente: entender o ambiente, o contexto de execução
        e o comportamento da linguagem desde a base.
      </p>
      <p>
        Esse tipo de entendimento é o que permite resolver problemas reais.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">O que vem a seguir</h2>
      <p>
        Nas próximas aulas, vamos aprofundar como o JavaScript é executado:
        contexto de execução, escopo, variáveis e comportamento interno da linguagem.
      </p>
      <p>
        Cada aula constrói sobre a anterior. Reforçar esses conceitos agora
        vai facilitar muito o entendimento mais à frente.
      </p>
    </section>
  <section class="lesson__section">   <pre><code>// Não faça isso em produção — bloqueia o thread por ~5s
const inicio = Date.now()
while (Date.now() - inicio < 5000) {
  // loop vazio travando o browser
}
console.log("Desbloqueado depois de 5 segundos")</code></pre> vai facilitar muito o entendimento mais à frente.</section>


  `;
}