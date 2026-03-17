// src/pages/content/fundamentos/05-comentarios.js
// ─────────────────────────────────────────────────────────────────────────────
// Conteúdo da aula: Comentários e boas práticas
// Módulo: Fundamentos
// ─────────────────────────────────────────────────────────────────────────────

export function content() {
  return /*html*/`

    <section class="lesson__section">
      <h2 class="lesson__section-title">Para que servem comentários</h2>
      <p>
        Comentários são trechos de texto ignorados pelo engine — eles existem para
        o programador, não para a máquina. Um bom comentário explica o
        <em>porquê</em> de uma decisão, não o <em>o quê</em> o código faz.
        O código em si já diz o quê; o comentário diz por que foi feito assim.
      </p>
      <p>
        Comentar o óbvio é ruído. Comentar a intenção por trás de uma escolha
        não trivial é valor. A diferença entre os dois é o que separa comentários
        úteis de comentários que atrapalham a leitura.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Sintaxe dos comentários</h2>
      <p>
        JavaScript tem dois tipos de comentário: de linha única e de bloco.
      </p>

      <pre><code>// Comentário de linha — tudo após // é ignorado
const taxa = 0.1 // 10% de taxa de serviço

/*
  Comentário de bloco — útil para explicações
  mais longas que ocupam múltiplas linhas.
  Tudo entre /* e é ignorado pelo engine.
*/
function calcularDesconto(valor, percentual) {
  return valor * (percentual / 100)
}</code></pre>

      <p>
        Comentários de linha são mais comuns no dia a dia. Comentários de bloco
        aparecem mais em documentação de funções públicas ou para desativar
        temporariamente um trecho de código durante debugging.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Comentários que agregam vs. comentários que poluem</h2>
      <p>
        Um comentário que apenas repete o que o código já diz não adiciona nada —
        e ainda precisará ser atualizado toda vez que o código mudar.
      </p>

      <pre><code>// ❌ Comentário inútil — repete o código
// Incrementa i em 1
i++

// ❌ Comentário desatualizado — pior que nenhum
// Retorna o nome do usuário
function getAge(user) {  // na verdade retorna a idade
  return user.age
}

// ✅ Comentário útil — explica o porquê
// RFC 5322 permite endereços com + e pontos antes do @
// A regex padrão do HTML5 rejeita esses casos, então usamos uma customizada
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

// ✅ Comentário útil — avisa sobre comportamento não óbvio
// Date.getMonth() retorna 0-11, não 1-12
const mes = new Date().getMonth() + 1</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Nomes que dispensam comentários</h2>
      <p>
        O melhor comentário é o código que não precisa de um. Nomes bem escolhidos
        para variáveis e funções comunicam intenção sem precisar de explicação
        adicional.
      </p>

      <pre><code>// ❌ Nomes que forçam comentários
const d = 7    // dias
const x = []   // lista de usuários ativos
function p(u) { /* processa usuário */ }

// ✅ Nomes que dispensam comentários
const diasDaSemana = 7
const usuariosAtivos = []
function processarUsuario(usuario) { /* ... */ }

// ❌ Variável booleana ambígua
if (flag) { /* ... */ }

// ✅ Variável booleana descritiva
if (usuarioEstaAutenticado) { /* ... */ }</code></pre>

      <p>
        Isso não significa que nomes longos são sempre melhores. O objetivo é
        clareza — às vezes uma letra é perfeitamente legível no contexto certo,
        como <em>i</em> em um loop de índice ou <em>x</em> em uma função matemática.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Convenções de nomenclatura</h2>
      <p>
        JavaScript tem convenções amplamente adotadas pela comunidade. Seguí-las
        torna o código previsível para qualquer pessoa familiarizada com a linguagem.
      </p>

      <pre><code>// camelCase — variáveis e funções
const nomeCompleto = "Ana Silva"
const totalDeItens = 42
function calcularPrecoFinal(preco, desconto) { /* ... */ }

// PascalCase — classes e construtores
class ContaBancaria { /* ... */ }
class UsuarioAdmin extends Usuario { /* ... */ }

// SCREAMING_SNAKE_CASE — constantes globais imutáveis
const MAX_TENTATIVAS = 3
const URL_BASE_API = "https://api.exemplo.com"

// Prefixo _ (underscore) — convenção para "privado"
// (não há privacidade real em JS sem # ou closures)
class Configuracao {
  _valorInterno = 0   // sinaliza: não use fora da classe
}

// Prefixo is/has/can — booleanos
const isLogado = true
const hasPermissao = false
const canEditar = true</code></pre>

    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Formatação e consistência</h2>
      <p>
        Código bem formatado é mais fácil de ler, revisar e depurar. As convenções
        mais comuns em projetos JavaScript modernos:
      </p>

      <pre><code>// Indentação: 2 espaços (mais comum em JS) ou 4 espaços
function exemplo() {
  if (condicao) {
    fazerAlgo()
  }
}

// Aspas: simples ou duplas — escolha uma e mantenha
const nome = "Ana"    // duplas
const cidade = 'SP'   // simples — ambas funcionam, seja consistente

// Template literals para interpolação
const mensagem = \`Olá, \${nome}! Você está em \${cidade}.\`

// Espaço antes de chaves em blocos
if (condicao) {   // ✅
if(condicao){     // ❌ — difícil de ler

// Linha em branco entre blocos lógicos distintos
function processarPedido(pedido) {
  validarPedido(pedido)

  const total = calcularTotal(pedido.itens)
  const desconto = calcularDesconto(total)

  salvarNoBanco({ ...pedido, total, desconto })
}</code></pre>

      <p>
        Em projetos reais, essas decisões são automatizadas por ferramentas como
        o <strong>Prettier</strong> — um formatador que aplica estilo consistente
        em todo o código sem discussão. Configurar o Prettier no projeto elimina
        debates sobre tabs vs. espaços e foco vai para o que importa.
      </p>
    </section>

    <section class="lesson__section">
      <h2 class="lesson__section-title">Uma função, uma responsabilidade</h2>
      <p>
        Funções pequenas com responsabilidade única são mais fáceis de testar,
        reusar e entender. Uma função que faz três coisas ao mesmo tempo é
        candidata a ser dividida em três funções menores.
      </p>

      <pre><code>// ❌ Função fazendo muita coisa
function processarUsuario(dados) {
  // valida
  if (!dados.email) throw new Error("Email obrigatório")
  if (!dados.nome) throw new Error("Nome obrigatório")
  // formata
  dados.email = dados.email.toLowerCase().trim()
  dados.nome = dados.nome.trim()
  // salva
  banco.inserir(dados)
  // notifica
  email.enviarBoasVindas(dados.email)
}

// ✅ Responsabilidades separadas
function validarUsuario(dados) {
  if (!dados.email) throw new Error("Email obrigatório")
  if (!dados.nome) throw new Error("Nome obrigatório")
}

function normalizarUsuario(dados) {
  return {
    ...dados,
    email: dados.email.toLowerCase().trim(),
    nome: dados.nome.trim(),
  }
}

function criarUsuario(dados) {
  validarUsuario(dados)
  const normalizado = normalizarUsuario(dados)
  banco.inserir(normalizado)
  email.enviarBoasVindas(normalizado.email)
}</code></pre>

    </section>

  `;
}