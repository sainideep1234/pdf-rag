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
const express_1 = __importDefault(require("express"));
const uploadfile_1 = require("./utils/uploadfile");
const bullmq_1 = require("bullmq");
const cors_1 = __importDefault(require("cors"));
const llmModel_1 = require("./utils/llmModel");
const embedingmodel_1 = require("./utils/embedingmodel");
const qdrant_1 = require("@langchain/qdrant");
const app = (0, express_1.default)();
const queue = new bullmq_1.Queue("file-upload-queue", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/upload/pdf", uploadfile_1.upload.single("pdf"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    yield queue.add("file-ready", JSON.stringify({
        fileName: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
        source: (_b = req.file) === null || _b === void 0 ? void 0 : _b.destination,
        destination: (_c = req.file) === null || _c === void 0 ? void 0 : _c.path,
    }));
    res.json({
        msg: "uploaded",
    });
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQuery = req.body.prompt;
        if (!userQuery) {
            res.send("No Prompt");
            return;
        }
        const vectorStore = yield qdrant_1.QdrantVectorStore.fromExistingCollection(embedingmodel_1.embeddings, {
            url: `http://localhost:6333`,
            collectionName: "pdf-docs",
        });
        const response = yield vectorStore.similaritySearch(userQuery, 5);
        const aiMsg = yield (0, llmModel_1.LlmModelChat)(response, userQuery);
        res.json({
            aiMsg: aiMsg.content,
            msg: "successfull",
        });
        return;
    }
    catch (error) {
        console.log("SERVVER ERROR: ", error);
    }
}));
app.listen(8000, () => {
    console.log(`server is working on port: ${8000}`);
});
