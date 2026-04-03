import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Chat
  app.post("/api/chat", async (req, res) => {
    const { message, version } = req.body;
    const isVip = version === 'vip';
    
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: isVip 
            ? `你是"银行私享健康"VIP版的专属健康管家。你的服务对象是银行的高端VIP客户（高净值人群）。
               你的目标是：
               1. 语气必须极其专业、优雅、谦逊且富有同理心。称呼用户为"尊敬的客户"或"您"。
               2. 强调"私享"、"定制"、"全球资源"和"长寿管理"的概念。
               3. 当用户询问健康问题时，除了专业建议，还要引导其联系"全球医疗绿通"或"私人医生"进行深度咨询。
               4. 保持回答简洁、精准，体现效率。`
            : `你是"银行康小智"，银行工会的智慧健康管家。你的服务对象是银行的普通员工。
               你的目标是：
               1. 语气亲切、专业、充满活力。称呼用户为"伙伴"或"您"。
               2. 关注员工的职业健康、压力缓解和工会福利。
               3. 提供实用的健康建议，如工位拉伸、护眼知识等。
               4. 保持回答简洁、温暖。`
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // API Route for Mental Assessment
  app.post("/api/mental-assessment", async (req, res) => {
    const { transcription } = req.body;
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `用户说："${transcription}"。请根据这段话分析用户的情绪压力水平，并给出简短的建议。`,
        config: {
          systemInstruction: `你是"银行康小智"的AI心理评估专家。
          你的任务是：
          1. 分析用户的语音转文字内容。
          2. 给出压力指数（低、中、高）。
          3. 给出一条非常具体的、适合银行员工在工位上执行的心理调节建议（如冥想、呼吸法、拉伸等）。
          4. 回复格式必须简洁，例如："压力指数：中等。建议：尝试3分钟深呼吸法。"`,
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Mental Error:", error);
      res.status(500).json({ error: "Failed to get AI assessment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      app.get("*", (req, res) => {
        res.status(500).send("Build artifacts not found. Please run 'npm run build' first.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
