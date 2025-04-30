import express, { json, Request, Response } from "express";
import { upload } from "./utils/uploadfile";
import { Queue } from "bullmq";
import cors from "cors";
import { LlmModelChat } from "./utils/llmModel";
import { embeddings } from "./utils/embedingmodel";
import { QdrantVectorStore } from "@langchain/qdrant";

import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

app.use(express.json());
app.use(cors());

app.post(
  "/upload/pdf",
  authMiddleware,
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    await queue.add(
      "file-ready",
      JSON.stringify({
        fileName: req.file?.originalname,
        source: req.file?.destination,
        destination: req.file?.path,
      })
    );

    res.json({
      msg: "uploaded",
    });
  }
);

app.post("/chat", async (req: Request, res: Response) => {
  try {
    const userQuery = req.body.prompt;

    if (!userQuery) {
      res.send("No Prompt");
      return;
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: `http://localhost:6333`,
        collectionName: "pdf-docs",
      }
    );

    const response = await vectorStore.similaritySearch(userQuery, 5);

    const aiMsg = await LlmModelChat(response, userQuery);

    res.json({
      aiMsg: aiMsg.content,
      msg: "successfull",
    });
    return;
  } catch (error) {
    console.log("SERVVER ERROR: ", error);
  }
});

app.listen(8000, () => {
  console.log(`server is working on port: ${8000}`);
});
