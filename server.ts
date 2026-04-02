import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

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
    const { message, history } = req.body;
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: `你是"银行康小智"应用的AI健康助手。
          当前用户健康数据：
          - 健康分：92 (优秀)
          - 心率：72 bpm
          - 血压：118/76 mmHg (正常)
          - 心理状态：良好
          - 趋势：较上月提升2.4%
          
          你的目标是：
          1. 以专业、亲切、符合银行员工语境的方式回答健康问题。
          2. 如果用户问到具体数据，请基于上述数据回答。
          3. 鼓励用户参加工会的健康干预项目，如"超能宝"或"稳赢120/80"。
          4. 保持回答简洁有力，适合手机端阅读。`
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
