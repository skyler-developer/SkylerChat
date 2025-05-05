import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
    try {
        const { sessionContent } = await request.json();
        console.log("追问问题上下文:", sessionContent);

        // 构造 prompt，要求模型输出追问问题，格式为JSON
        const prompt = `请基于以下JSON格式的历史对话，生成3个强相关的、并且有针对性的追问问题，要求输出JSON数组格式，如
\`\`\`json
[
  {
    "index": 0,
    "content": "这是第一个相关追问问题？（你要替换掉其中的文字为相关问题）"
  },
  {
    "index": 1,
    "content": "这是第二个相关追问问题？（你要替换掉其中的文字为相关问题）"
  },
  {
    "index": 2,
    "content": "这是第三个相关追问问题？（你要替换掉其中的文字为相关问题）"
  }
]
\`\`\``;
        const response = await ollama.chat({
            model: "qwen3:0.6b",
            messages: [
                { role: "user", content: prompt },
                { role: "user", content: `${sessionContent} /no_think` },
            ],
        });
        let result = "";
        try {
            result =
                response.message?.content?.trim().split("```json")[1].split("```")[0].trim() || "";
        } catch (e) {
            console.error("Error parsing response:", e);
        }

        // 尝试解析为JSON
        let questions;
        try {
            questions = JSON.parse(result);
        } catch (e) {
            questions = [result];
        }
        console.log("追问问题:", questions);
        return new Response(JSON.stringify({ success: true, questions }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error generating probe questions:", error);
        return new Response(JSON.stringify({ success: false, message: "获取追问问题失败" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
