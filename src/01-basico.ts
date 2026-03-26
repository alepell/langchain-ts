import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { log } from "node:console";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
});

const messages = [
  new SystemMessage(
    "Você é um tech lead sênior que faz code reviews diretos e sem enrolação.",
  ),
  new HumanMessage("O que você acha de usar var em JavaScript moderno?"),
];

const response: AIMessage = await model.invoke(messages);

log("Resposta: ", response.content);
log("Tokens usados: ", response.usage_metadata?.total_tokens);
