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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTheFileFromServer = void 0;
const bullmq_1 = require("bullmq");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const vectorstore_1 = require("./vectorstore");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
const deleteTheFileFromServer = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    yield unlinkAsync(filePath);
});
exports.deleteTheFileFromServer = deleteTheFileFromServer;
const worker = new bullmq_1.Worker("file-upload-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(job.data);
    const loader = new pdf_1.PDFLoader(data.destination);
    const docs = yield loader.load();
    yield (0, vectorstore_1.createVectorEmbeddings)(docs);
    console.log(`all docs are uploaded to vector store `);
    //code to delte he fiel from server
    yield (0, exports.deleteTheFileFromServer)(data.destination);
    console.log("file delte succesfully");
}), {
    concurrency: 100,
    connection: {
        host: "localhost",
        port: 6379,
    },
});
