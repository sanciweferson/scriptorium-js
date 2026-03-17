// src/core/guards.js
// ─────────────────────────────────────────────────────────────────────────────
// Responsabilidade deste módulo:
//   Exportar funções de guard para serem usadas pela pipeline.
//
// Cada guard segue o mesmo contrato de assinatura:
//   (from: string, to: string, next: Function) => void
//
//   from → pathname atual (de onde o usuário está saindo)
//   to   → pathname de destino (para onde quer ir)
//   next → função da pipeline que o guard DEVE chamar para continuar,
//           ou ignorar para bloquear silenciosamente
//
// Guards são funções puras de decisão — eles não navegam, não renderizam,
// não sabem quantos outros guards existem. Só decidem e delegam.
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// logGuard
//
// Guard de observabilidade: registra cada tentativa de navegação no console.
// Nunca bloqueia, nunca redireciona — sua única função é deixar rastro.
//
// Útil para:
//   - Debugar o fluxo de navegação durante desenvolvimento
//   - Auditar quais rotas foram acessadas (em versões mais elaboradas)
//   - Confirmar que a pipeline está sendo disparada corretamente
// ─────────────────────────────────────────────────────────────────────────────
export function logGuard(from, to, next) {

  // Template literal que monta a mensagem de log.
  //
  // `from || "entrada"`:
  //   Operador OR lógico: se `from` for falsy (null, undefined, "" — string vazia),
  //   usa a string "entrada" como fallback.
  //   Isso acontece na primeira navegação: quando a SPA carrega pela primeira vez,
  //   não há rota anterior — `from` pode ser null ou string vazia.
  //   "entrada" torna o log legível: "[router] navegando: entrada → /"
  //   Em vez de:                     "[router] navegando:  → /"  (confuso)
  //
  // `to`:
  //   O destino sempre existe quando um guard é executado — é a rota que
  //   o usuário quer acessar. Não precisa de fallback.
  //
  // O prefixo "[router]" facilita filtrar logs por módulo no DevTools:
  //   console.filter("[router]" ) mostra só logs deste sistema.
  console.log(`[router] navegando: ${from || "entrada"} → ${to}`);

  // Sempre chama next() sem argumento: "aprovado, continue a pipeline".
  // logGuard é um guard de passagem — jamais deve bloquear ou redirecionar.
  // Seu trabalho é só observar e registrar.
  next();
}


// ─────────────────────────────────────────────────────────────────────────────
// authGuard
//
// Guard de autenticação: protege rotas privadas contra acesso não autorizado.
//
// Lógica de decisão em três ramos:
//
//   1. Rota não está na lista de protegidas → deixa passar (qualquer usuário)
//   2. Rota protegida + usuário autenticado  → deixa passar
//   3. Rota protegida + usuário não autenticado → redireciona para /login
// ─────────────────────────────────────────────────────────────────────────────
export function authGuard(from, to, next) {

  // Array com os pathnames que exigem autenticação.
  //
  // Por que declarar dentro da função e não fora como constante do módulo?
  //   Aqui é uma escolha de escopo intencional: a lista é privada deste guard.
  //   Nenhum outro módulo precisa saber quais rotas são protegidas —
  //   essa é uma decisão interna do authGuard.
  //   Se fosse necessário compartilhar essa lista (ex: para marcar links
  //   visualmente como privados), aí sim valeria mover para fora.
  //
  // Futuramente esta lista poderia vir de uma configuração externa,
  // de uma API, ou ser derivada do próprio array de rotas com uma flag
  // `{ path: "/admin", protected: true, component: Admin }`.
  const rotasProtegidas = ["/admin", "/perfil", "/configuracoes"];

  // Verifica se a rota de DESTINO está na lista de protegidas.
  //
  // Array.prototype.includes(value):
  //   Retorna true se `to` estiver no array, false caso contrário.
  //   Comparação exata de string — "/admin" bate em "/admin", não em "/adminx".
  //
  // `!rotasProtegidas.includes(to)`:
  //   O `!` inverte: entramos no if quando a rota NÃO está na lista.
  //   Ou seja: "se a rota é pública, deixa passar".
  if (!rotasProtegidas.includes(to)) {

    // Rota pública: chama next() para continuar a pipeline normalmente.
    next();

    // `return` explícito após o next() para garantir que o código abaixo
    // não execute mesmo que next() retorne (o que normalmente não acontece,
    // mas o return torna a intenção explícita e o fluxo previsível).
    return;
  }

  // Se chegamos aqui, a rota está na lista de protegidas.
  // Precisamos verificar se o usuário está autenticado.
  //
  // localStorage.getItem("user_token"):
  //   Lê o valor salvo sob a chave "user_token" no localStorage do browser.
  //   Retorna a string salva, ou `null` se a chave não existir.
  //
  // !! (double negation / double bang):
  //   Converte qualquer valor para boolean explicitamente.
  //   !!null           → false  (não autenticado: token não existe)
  //   !!"eyJhbGci..." → true   (autenticado: token existe e é string não-vazia)
  //   !!""             → false  (não autenticado: token existe mas está vazio)
  //
  // Por que `!!` em vez de só checar `if (localStorage.getItem(...))`?
  //   Tecnicamente o `if` funcionaria igual, mas `!!` deixa explícito que
  //   estamos trabalhando com um boolean, não com o valor bruto do token.
  //   É uma afirmação de intenção: "quero true/false, não a string".
  const estaAutenticado = !!localStorage.getItem("user_token");

  if (estaAutenticado) {

    // Usuário tem token válido: aprovado para acessar a rota protegida.
    // next() sem argumento = "continue a pipeline".
    next();

  } else {

    // Usuário não está autenticado: redireciona para a página de login.
    //
    // `?redirect=${to}` é uma query string que passa o destino original
    // como parâmetro para a página de login.
    //
    // Isso permite que, após o login bem-sucedido, a página de login
    // leia esse parâmetro e envie o usuário diretamente para onde ele
    // tentou ir — em vez de jogar todo mundo para a home.
    //
    // Exemplo: usuário tentou acessar "/perfil" sem estar logado.
    //   next(`/login?redirect=/perfil`)
    //   Após login → app lê ?redirect=/perfil → navega para "/perfil"
    //
    // next() com argumento = "redireciona e interrompe a pipeline".
    // O restante dos guards (se houver) não será executado.
    next(`/login?redirect=${to}`);
  }
}