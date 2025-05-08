"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddings = void 0;
const cohere_1 = require("@langchain/cohere");
exports.embeddings = new cohere_1.CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey: "3hbpz8432dHEh6KYPwSHf6gx4b7P7KytBizDgt3e"
});
