// src/core/cache.js
// ─────────────────────────────────────────────────────────────────────────────
// Responsabilidades deste módulo:
//   1. Guardar o HTML gerado por cada rota para evitar reprocessamento
//   2. Expirar entradas após um tempo definido (TTL)
//   3. Limitar o número de entradas em memória (LRU)
// ─────────────────────────────────────────────────────────────────────────────


// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────

// Limite máximo de páginas simultâneas no cache.
// Quando o cache chega nesse número e uma nova página precisa entrar,
// a entrada mais antiga é removida para dar lugar à nova (estratégia LRU).
const MAX_PAGES = 40;

// Time To Live: quanto tempo (em ms) uma entrada é considerada válida.
// Escrito como multiplicação para ser legível como "5 minutos":
//   5  →  minutos
//   60 →  segundos por minuto
//   1000 → milissegundos por segundo
// Resultado: 300.000ms. Após esse tempo, a entrada é descartada.
const TTL_MS = 5 * 60 * 1000;


// ─── ESTRUTURA DE DADOS ───────────────────────────────────────────────────────

// Map é escolhido em vez de objeto `{}` por dois motivos concretos:
//
//   1. ORDEM GARANTIDA: Map.keys() retorna chaves na ordem de inserção
//      pela especificação do JS. Isso é necessário para o LRU funcionar:
//      a primeira chave do Map é sempre a entrada mais antiga.
//
//   2. API NATIVA: `.size`, `.clear()`, `.has()` sem gambiarras.
//      Um objeto precisaria de Object.keys(obj).length para o tamanho,
//      e um loop com `delete` para limpar tudo.
//
// Cada entrada tem a forma:
//   pageCache.set("/fundamentos/closures", { content: "<...html...>", createdAt: 1710000000000 })
//                 ↑ chave (pathname)          ↑ valor (objeto com HTML e timestamp)
const pageCache = new Map();


// ─────────────────────────────────────────────────────────────────────────────
// hasPage(path)
//
// Pergunta: "posso usar o cache para este path?"
// Resposta: true só se a entrada EXISTE e ainda está DENTRO DO TTL.
//
// Duas condições de saída antecipada (early return):
//   - Entrada não existe no Map → false
//   - Entrada existe mas expirou → deleta e retorna false
//
// Se chegou ao final sem retornar antes → true (entrada válida).
// ─────────────────────────────────────────────────────────────────────────────
export function hasPage(path) {

  // Map.get() retorna o valor associado à chave, ou `undefined` se não existir.
  // `entry` será ou um objeto { content, createdAt } ou `undefined`.
  const entry = pageCache.get(path);

  // Guard clause #1: chave não existe.
  // `!undefined` é `true`, então este if dispara quando a entrada não foi encontrada.
  // O `return false` sai da função imediatamente — sem executar nada abaixo.
  if (!entry) return false;

  // Calcula quanto tempo passou desde que a entrada foi criada.
  //
  // Date.now() → timestamp atual em ms (ex: 1710005000000)
  // entry.createdAt → timestamp de quando savePage() foi chamado (ex: 1710004700000)
  // Subtração → tempo decorrido em ms (ex: 300000 = exatamente 5 minutos)
  //
  // isExpired será `true` se o tempo decorrido ULTRAPASSOU o limite do TTL.
  const isExpired = Date.now() - entry.createdAt > TTL_MS;

  // Guard clause #2: entrada existe mas expirou.
  if (isExpired) {

    // Lazy expiration: remove a entrada no momento em que descobrimos que expirou.
    // "Lazy" porque não existe um processo separado varrendo o cache periodicamente.
    // A limpeza acontece organicamente, no fluxo normal de uso.
    pageCache.delete(path);

    // Retorna false — a entrada expirada não pode ser usada.
    return false;
  }

  // Chegou aqui: entrada existe E ainda está dentro do TTL.
  return true;
}


// ─────────────────────────────────────────────────────────────────────────────
// savePage(path, content)
//
// Salva uma entrada no cache aplicando duas estratégias em sequência:
//
//   A) Se o path JÁ existe: deleta e reinsere (move para o fim da fila LRU)
//   B) Se o cache LOTOU: remove a entrada mais antiga antes de inserir
//
// Depois de A ou B (ou nenhum dos dois, se há espaço livre e é entrada nova),
// insere o novo par { content, createdAt } no Map.
// ─────────────────────────────────────────────────────────────────────────────
export function savePage(path, content) {

  // Verifica se este path já tem uma entrada no cache.
  // Map.has() retorna boolean — true se a chave existe, false se não.
  if (pageCache.has(path)) {

    // Entrada já existe: removemos para reinserir logo abaixo.
    //
    // Por que não simplesmente atualizar no lugar?
    // Map.set() numa chave existente atualiza o valor MAS mantém a posição
    // original na ordem de inserção. A entrada continuaria "velha" na fila LRU.
    //
    // Deletar + reinserir move a entrada para o FINAL da fila,
    // tornando-a a mais recente — a última a ser removida pelo LRU.
    pageCache.delete(path);

  } else if (pageCache.size >= MAX_PAGES) {
    // `else if` e não `if` separado: se entramos no bloco acima (deletamos),
    // o size do Map diminuiu em 1 — não precisamos remover outra entrada.
    // O `else if` garante que apenas UMA das duas ações ocorre por chamada.
    //
    // pageCache.size >= MAX_PAGES: cache lotou com entradas DIFERENTES deste path.
    // Precisamos remover a mais antiga para abrir espaço.
    //
    // Como identificar a mais antiga?
    //   pageCache.keys() → Iterator das chaves na ordem de inserção
    //   .next()          → { value: primeiraChave, done: false }
    //   .value           → a string da chave mais antiga (ex: "/")
    const oldestKey = pageCache.keys().next().value;

    // Remove a entrada mais antiga do Map, liberando espaço para a nova.
    pageCache.delete(oldestKey);
  }

  // Insere a nova entrada (ou a reinsere, se era existente).
  // O valor é um objeto com dois campos:
  //   content   → o HTML gerado pelo componente da rota (string)
  //   createdAt → timestamp de agora, usado por hasPage() para calcular expiração
  pageCache.set(path, {
    content,
    createdAt: Date.now(),
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// getPage(path)
//
// Recupera apenas o HTML de uma entrada.
// O objeto interno { content, createdAt } é um detalhe de implementação —
// quem chama getPage() não precisa e não deve saber que ele existe.
// ─────────────────────────────────────────────────────────────────────────────
export function getPage(path) {

  // Busca o objeto completo { content, createdAt } pelo path.
  // Pode ser undefined se chamado sem hasPage() antes (uso incorreto).
  const entry = pageCache.get(path);

  // Ternário defensivo:
  //   entry existe → retorna apenas o HTML (entry.content)
  //   entry é undefined → retorna undefined sem lançar TypeError
  //
  // `entry.content` direto quebraria com "Cannot read properties of undefined"
  // se getPage() fosse chamado para um path que não está no cache.
  // O ternário evita esse crash silenciosamente.
  //
  // Contrato de uso correto (como render.js faz):
  //   if (hasPage(path)) return getPage(path)
  //   ↑ hasPage garante que getPage nunca recebe um path inexistente
  return entry ? entry.content : undefined;
}


// ─────────────────────────────────────────────────────────────────────────────
// clearCache()
//
// Esvazia todo o cache de uma vez.
// Útil em: logout, hot-reload durante dev, testes automatizados.
// ─────────────────────────────────────────────────────────────────────────────
export function clearCache() {

  // Map.clear() remove TODAS as entradas em O(1).
  // É o equivalente nativo ao loop `for (key in obj) delete obj[key]`
  // que seria necessário com objeto simples — mais simples e mais rápido.
  pageCache.clear();
}


// ─────────────────────────────────────────────────────────────────────────────
// getCacheStats()
//
// Retorna um snapshot do estado atual do cache para inspeção no console.
// Exclusiva para desenvolvimento — não é chamada por nenhum outro módulo.
//
// Uso no console do DevTools:
//   import { getCacheStats } from "./cache.js"
//   console.log(getCacheStats())
//   // → { size: 3, pages: ["/", "/sobre", "/fundamentos/01-hoisting"] }
// ─────────────────────────────────────────────────────────────────────────────
export function getCacheStats() {

  return {
    // pageCache.size: propriedade nativa do Map.
    // Reflete o número atual de entradas sem precisar iterar.
    size: pageCache.size,

    // pageCache.keys() retorna um Iterator — um objeto "lazy" que gera
    // os valores um a um, não todos de uma vez.
    //
    // Array.from() consome esse Iterator e produz um array real,
    // que é serializável, imprimível no console e iterável com métodos de array.
    //
    // Exemplo: Map com chaves "/", "/sobre", "/fundamentos/closures"
    //   pageCache.keys() → Iterator { "/", "/sobre", "/fundamentos/closures" }
    //   Array.from(...)  → ["/", "/sobre", "/fundamentos/closures"]
    pages: Array.from(pageCache.keys()),
  };
}