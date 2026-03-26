import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7,
  });

  const parser = new StringOutputParser();

  // Template com espaço reservado pro histórico
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um assistente técnico especialista em TypeScript e Node.js.
Seja direto e objetivo nas respostas.`,
    ],
    // Aqui é onde o histórico vai ser injetado
    new MessagesPlaceholder("historico"),
    ["human", "{input}"],
  ]);

  const chain = template.pipe(model).pipe(parser);

  // Histórico começa vazio
  const historico: BaseMessage[] = [];

  // Função que simula uma mensagem do usuário
  async function chat(input: string): Promise<string> {
    console.log(`\nUsuário: ${input}`);

    const response = await chain.invoke({
      historico,
      input,
    });

    // Salva no histórico: mensagem do usuário + resposta do modelo
    historico.push(new HumanMessage(input));
    historico.push(new AIMessage(response));

    console.log(`Assistente: ${response}`);
    return response;
  }

  // Simula uma conversa com contexto acumulando
  await chat("Oi! Pode me chamar de Alexandre.");
  await chat("Qual é o meu nome?");
  await chat("Estou com um problema. Meu código TypeScript não compila.");
  await chat("O erro é: Type 'string' is not assignable to type 'number'");
  await chat("Como eu corrijo isso?");
  await chat("Pode me dar um exemplo completo com o meu nome no código?");
}

main();
