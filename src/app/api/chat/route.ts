import { NextRequest } from "next/server";
import ollama from "ollama";
import { db } from "../userInfo/router";
import { generateTitle } from "./getTitle";
import { answerWithRag, loadAndProcessMarkdown } from "../RAG/chain";

export async function POST(request: NextRequest) {
    try {
        const { message, username, sessionId, intelligentAgentName } = await request.json();

        // 查询智能体数据
        let agentData = null;
        if (intelligentAgentName) {
            try {
                const [agentRows]: any = await db.query(
                    "SELECT agentData FROM intelligentAgentInfo WHERE intelligentAgentName = ?",
                    [intelligentAgentName],
                );
                if (agentRows.length > 0) {
                    agentData = agentRows[0].agentData;
                    // console.log("agentData", agentData);
                }
            } catch (dbError) {
                console.error("查询智能体数据出错:", dbError);
                return new Response(JSON.stringify({ error: "查询智能体数据出错" }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        }

        let rows;
        let historySession = null;
        try {
            // 查询 sessionrecords 表
            [rows] = await db.query("SELECT * FROM sessionrecords WHERE sessionId = ?", [
                sessionId,
            ]);
            // console.log("Session Records:", rows);
            historySession = (rows as any[])?.[0]?.sessionInfo || [];
        } catch (dbError) {
            console.error("Database query error:", dbError);
            return new Response(JSON.stringify({ error: "数据库查询出错" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        // const answer = await answerWithRag(message, agentData);
        // console.log("answerWithRag", answer);

        // 根据智能体名称选择不同的处理方式
        if (intelligentAgentName === "工大小灵通") {
            const stream = await loadAndProcessMarkdown(message);
            console.log("开始流式输出：");
            for await (const chunk of stream) {
                console.log("chunk:", chunk);
            }
            console.log("流式输出结束");
        }

        // 记录用户行为
        await fetch("http://localhost:3000/api/intelligentAgent/recordBehavior", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: username,
                intelligentAgentName,
                sessionId,
                interactionType: "use",
            }),
        });

        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
            async start(controller) {
                let fullContent = "";

                if (intelligentAgentName === "工大小灵通") {
                    // 使用 RAG 链的流式输出
                    const stream = await loadAndProcessMarkdown(message);
                    for await (const chunk of stream) {
                        fullContent += chunk;
                        controller.enqueue(encoder.encode(chunk));
                    }
                } else {
                    // 使用原有的 Ollama 聊天
                    const response = await ollama.chat({
                        model: "deepseek-r1",
                        messages: [
                            {
                                role: "user",
                                content:
                                    agentData ||
                                    "请所有的回答都采用markdown格式输出，为了良好的阅读体验，回答内容尽量采用结构化的方式输出，使用标题、列表等格式化内容。",
                            },
                            ...historySession,
                            { role: "user", content: message },
                        ],
                        stream: true,
                    });

                    for await (const chunk of response) {
                        const text = chunk.message?.content || "";
                        fullContent += text;
                        controller.enqueue(encoder.encode(text));
                    }
                }

                // 数据库存储逻辑
                try {
                    const timeStamp = Date.now();
                    const sessionInfo = JSON.stringify([
                        ...historySession,
                        {
                            role: "user",
                            content: message,
                        },
                        {
                            role: "assistant",
                            content: fullContent,
                        },
                    ]);

                    if ((rows as any[]).length > 0) {
                        // 已存在，更新
                        await db.query(
                            "UPDATE sessionrecords SET timeStamp = ?, sessionInfo = ?, intelligentAgentName = ? WHERE sessionId = ?",
                            [timeStamp, sessionInfo, intelligentAgentName || "", sessionId],
                        );
                    } else if (username !== "") {
                        const title = await generateTitle(sessionInfo);

                        // 不存在，插入
                        await db.query(
                            "INSERT INTO sessionrecords (username, sessionId, timeStamp, sessionInfo, title, intelligentAgentName) VALUES (?, ?, ?, ?, ?, ?)",
                            [
                                username,
                                sessionId,
                                timeStamp,
                                sessionInfo,
                                title,
                                intelligentAgentName || "",
                            ],
                        );
                    }
                } catch (dbInsertError) {
                    console.error("Database insert error:", dbInsertError);
                }
                controller.close();
            },
        });

        return new Response(streamResponse, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "获取回答时出错" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
