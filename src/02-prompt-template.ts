import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0, // determinístico — code review não precisa de criatividade
  });

  // Define o template com variáveis entre chaves
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um tech lead sênior especialista em {linguagem}.
Faça code reviews diretos, sem elogios desnecessários.
Estruture sua resposta em 3 seções:
1. Problemas críticos
2. Melhorias sugeridas  
3. Código corrigido`,
    ],
    ["human", "Faça o code review deste código:\n\n{codigo}"],
  ]);

  // Reutiliza o mesmo template com inputs diferentes
  const casos = [
    {
      linguagem: "TypeScript",
      codigo: `
async function getUser(id) {
  const res = await fetch('/api/users/' + id)
  const data = res.json()
  return data
}`,
    },
    {
      linguagem: "TypeScript",
      codigo: `
function calcularDesconto(preco, desconto) {
  var resultado = preco - (preco * desconto / 100)
  return resultado
}`,
    },
  ];

  for (const caso of casos) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`Review — ${caso.linguagem}`);
    console.log("=".repeat(50));

    // Monta o prompt com os valores
    const messages = await template.invoke(caso);

    // Passa pro modelo
    const response = await model.invoke(messages);
    console.log(response.content);
  }
}

main();
