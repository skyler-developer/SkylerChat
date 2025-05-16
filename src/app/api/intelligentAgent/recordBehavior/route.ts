import { NextRequest, NextResponse } from "next/server";
import { db } from "../../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { userName, intelligentAgentName, sessionId, interactionType } = await request.json();
        if (!userName || !intelligentAgentName || !sessionId || !interactionType) {
            return NextResponse.json({ success: false, message: "参数不完整" }, { status: 400 });
        }
        await db.query(
            `INSERT INTO user_behavior 
            (user_name, intelligent_agent_name, session_id, interaction_type) 
            VALUES (?, ?, ?, ?)`,
            [userName, intelligentAgentName, sessionId, interactionType],
        );
        return NextResponse.json({ success: true, message: "行为记录成功" }, { status: 200 });
    } catch (error) {
        console.error("记录用户行为时出错:", error);
        return NextResponse.json(
            {
                success: false,
                message: "记录失败",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 },
        );
    }
}
