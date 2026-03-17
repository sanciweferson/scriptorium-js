// src/core/pipeline.js
// ─────────────────────────────────────────────────────────────────────────────
// Responsabilidade deste módulo:
//   Executar uma sequência de "guards" antes de confirmar uma navegação.
//   Cada guard pode aprovar, bloquear ou redirecionar.
//
// Padrão de projeto aplicado: Chain of Responsibility
//   Cada guard na cadeia decide se passa a responsabilidade adiante (next())
//   ou interrompe o fluxo (bloqueando ou redirecionando).
//   Nenhum guard sabe quantos outros existem — cada um só decide sobre si.
// ─────────────────────────────────────────────────────────────────────────────

// Importa `navigate` para que um guard possa redirecionar para outra rota.
// `navigate` cuida do pushState + renderização — o guard não precisa saber disso.
import { navigate } from "@core/route";


// ─────────────────────────────────────────────────────────────────────────────
// runPipeline(guards, from, to, onComplete)
//
// Parâmetros:
//   guards     → Array de funções. Cada uma tem assinatura: (from, to, next) => void
//   from       → pathname de onde o usuário está saindo  (ex: "/")
//   to         → pathname de onde o usuário quer chegar  (ex: "/aula-privada")
//   onComplete → função chamada SE E SOMENTE SE todos os guards aprovaram
//
// Fluxo básico (3 guards, todos aprovam):
//
//   runPipeline([guardA, guardB, guardC], from, to, render)
//
//   next()          → index=0, executa guardA(from, to, next)
//     guardA chama next() → index=1, executa guardB(from, to, next)
//       guardB chama next() → index=2, executa guardC(from, to, next)
//         guardC chama next() → index=3, guards[3] é undefined → onComplete()
//
// Fluxo com bloqueio (guardB bloqueia):
//
//   next()          → executa guardA → guardA chama next()
//     next()        → executa guardB → guardB NÃO chama next()
//       onComplete nunca é chamado. Navegação cancelada silenciosamente.
//
// Fluxo com redirecionamento (guardB redireciona para "/login"):
//
//   next()          → executa guardA → guardA chama next()
//     next("/login") → navigate("/login") é chamado, função retorna imediatamente.
//       guardC nunca executa. onComplete nunca é chamado.
// ─────────────────────────────────────────────────────────────────────────────
export function runPipeline(guards, from, to, onComplete) {

  // Cursor que rastreia qual guard será executado na próxima chamada de next().
  // Começa em 0 (primeiro guard) e é incrementado a cada avanço da cadeia.
  // Declarado com `let` porque seu valor muda a cada chamada de next().
  //
  // Por que não passamos `index` como parâmetro de next()?
  // Porque next() é uma closure — ela "enxerga" e modifica o `index` do escopo
  // pai (runPipeline) diretamente. Isso evita passar estado extra entre chamadas.
  let index = 0;

  // ── next(redirectTo?) ──────────────────────────────────────────────────────
  //
  // Função interna que cada guard recebe como terceiro argumento.
  // É a única forma de um guard comunicar sua decisão para a pipeline.
  //
  // Três comportamentos dependendo de como o guard a chama:
  //
  //   next()           → sem argumento: "aprovado, passa pro próximo"
  //   next("/caminho") → com string:    "redireciona e para tudo"
  //   (não chama)      → silêncio:      "bloqueado, para tudo sem redirecionar"
  //
  // `redirectTo` é opcional — se o guard não passar nada, será `undefined`.
  function next(redirectTo) {

    // Guard clause: se next() foi chamada COM um argumento (redirectTo é truthy),
    // o guard quer redirecionar para outra rota.
    //
    // `navigate(redirectTo)` cuida de tudo: pushState, atualização do DOM.
    // O `return` logo após interrompe a execução de next() imediatamente —
    // nenhum guard subsequente é executado, onComplete nunca é chamado.
    if (redirectTo) {
      navigate(redirectTo);
      return;
    }

    // Se chegamos aqui, next() foi chamada SEM argumento: o guard aprovou.
    // Precisamos avançar para o próximo guard da sequência.
    //
    // Lê o guard na posição atual ANTES de incrementar.
    // Exemplo: se index=1, currentGuard = guards[1] (segundo guard).
    const currentGuard = guards[index];

    // Incrementa o cursor DEPOIS de ler o guard atual.
    // Na próxima chamada de next(), `index` já apontará para o guard seguinte.
    //
    // Por que incrementar depois, e não antes?
    // Se incrementássemos antes, `guards[index]` pularia o guard atual.
    // A sequência seria: lê index=0, incrementa para 1, executa guards[0]. ✓
    // Não: incrementa para 1, lê guards[1], pulando guards[0]. ✗
    index++;

    // Verifica se ainda existe um guard na posição lida.
    // `currentGuard` é undefined quando index ultrapassou o último elemento.
    if (currentGuard) {

      // Ainda há guards na fila: executa o atual, passando:
      //   from → pathname de origem (informação para o guard decidir)
      //   to   → pathname de destino (idem)
      //   next → a mesma função, para o guard poder continuar a cadeia
      //
      // O guard agora tem controle total: pode chamar next(), next("/x") ou nada.
      currentGuard(from, to, next);

    } else {

      // `currentGuard` é undefined: todos os guards foram executados e aprovaram.
      // A pipeline chegou ao fim com sucesso — executa o callback final.
      //
      // `onComplete` é geralmente a função que confirma a navegação:
      // atualiza o DOM, marca o link ativo, etc.
      onComplete();
    }
  }

  // Dispara a cadeia chamando next() pela primeira vez, sem argumento.
  // Este é o único ponto de entrada — tudo começa aqui.
  //
  // Por que não chamar guards[0] diretamente?
  // Porque reutilizar next() centraliza toda a lógica de avanço em um lugar.
  // Se chamássemos guards[0] diretamente, teríamos que duplicar a lógica
  // de "verifica se existe, incrementa index, chama onComplete" fora do next().
  next();
}