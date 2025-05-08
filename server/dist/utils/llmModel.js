"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmModelChat = void 0;
const google_genai_1 = require("@langchain/google-genai");
const llm = new google_genai_1.ChatGoogleGenerativeAI({
    apiKey: "AIzaSyBWmXK5PbY7rFhiOjU1sbh4Dz-_xHS0hFk",
    model: "gemini-1.5-pro",
    temperature: 0,
    maxRetries: 2,
});
const LlmModelChat = (context, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const aiMsg = yield llm.invoke([
        [
            "system",
            `You are an expert analyst with deep reasoning skills and a background in engineering and cognitive science.
        Given the following context, your task is to identify what this is, based on all available clues.
        Use logical reasoning, analogies, and engineering-style thinking to explain your answer clearly.
        If something is unclear or ambiguous, make reasonable inferences. Your explanation should feel like a thoughtful human deduction, not just a lookup.
        Keep it concise but insightful, and if relevant, add a metaphor or analogy to deepen understanding. 
        CONTEXT:
        ${context}
        Output Format:
        What this is (in 1-2 lines)
        Why you think so (with reasoning)
        Any alternative interpretations (if applicable)`,
        ],
        ["human", `${prompt}`],
    ]);
    return aiMsg;
});
exports.LlmModelChat = LlmModelChat;
