import { CohereEmbeddings } from "@langchain/cohere";

export const embeddings = new CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey:"3hbpz8432dHEh6KYPwSHf6gx4b7P7KytBizDgt3e"
  });