import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  // Parser que extrai só o texto da resposta
  // Sem isso você recebe o objeto AIMessage inteiro
  const parser = new StringOutputParser();

  // ── PROMPT 1: Corrige o código ──────────────────
  const templateCorrecao = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um tech lead sênior em TypeScript.
Corrija o código recebido aplicando:
- Tipagem correta
- Boas práticas TypeScript
- Tratamento de erros
Retorne APENAS o código corrigido, sem explicações.`,
    ],
    ["human", "{codigo}"],
  ]);

  // ── PROMPT 2: Gera os testes ────────────────────
  const templateTestes = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um engenheiro de qualidade sênior.
Gere testes unitários com Jest para o código recebido.
Cubra: happy path, edge cases e erros esperados.
Use mocks para dependências externas.
Retorne APENAS o código de testes, sem explicações.`,
    ],
    ["human", "{codigoCorrigido}"],
  ]);

  // ── Monta a chain ───────────────────────────────
  // O pipe (|) encadeia: template → model → parser
  const chainCorrecao = templateCorrecao.pipe(model).pipe(parser);
  const chainTestes = templateTestes.pipe(model).pipe(parser);

  // ── Código de entrada ───────────────────────────
  const codigoOriginal = `
async function getUser(id) {
  const res = await fetch('/api/users/' + id)
  const data = res.json()
  return data
}`;

  console.log("Passo 1 — Corrigindo o código...\n");

  // Roda a primeira chain
  const codigoCorrigido = await chainCorrecao.invoke({
    codigo: codigoOriginal,
  });

  console.log("Código corrigido:");
  console.log(codigoCorrigido);

  console.log("\nPasso 2 — Gerando os testes...\n");

  // Output do passo 1 vira input do passo 2
  const testes = await chainTestes.invoke({
    codigoCorrigido,
  });

  console.log("Testes gerados:");
  console.log(testes);
}

main();
