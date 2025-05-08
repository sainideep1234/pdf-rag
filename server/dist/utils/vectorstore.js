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
exports.createVectorEmbeddings = void 0;
const qdrant_1 = require("@langchain/qdrant");
const js_client_rest_1 = require("@qdrant/js-client-rest");
const embedingmodel_1 = require("./embedingmodel");
const createVectorEmbeddings = (docs) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new js_client_rest_1.QdrantClient({ url: `http://localhost:6333` });
    yield qdrant_1.QdrantVectorStore.fromDocuments(docs, embedingmodel_1.embeddings, {
        client,
        collectionName: "pdf-docs",
    });
});
exports.createVectorEmbeddings = createVectorEmbeddings;
