import { NextRequest, NextResponse } from "next/server";
import { db } from "../../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { intelligentAgentName, agentData, userName, isPublic, headPicture } =
            await request.json();

        // 验证必填字段
        if (!intelligentAgentName || !agentData || !userName) {
            return NextResponse.json(
                {
                    success: false,
                    message: "智能体名称、提示词和用户名是必填项",
                },
                { status: 400 },
            );
        }

        // 检查智能体名称是否已存在
        const [existingAgents]: any = await db.query(
            "SELECT * FROM intelligentAgentInfo WHERE intelligentAgentName = ? AND userName = ?",
            [intelligentAgentName, userName],
        );

        if (existingAgents.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `智能体 "${intelligentAgentName}" 已存在，请使用其他名称`,
                    code: "DUPLICATE_AGENT_NAME",
                },
                { status: 409 },
            );
        }

        // 插入新智能体
        await db.query(
            "INSERT INTO intelligentAgentInfo (intelligentAgentName, agentData, userName, isPublic, headPicture) VALUES (?, ?, ?, ?, ?)",
            [
                intelligentAgentName,
                agentData,
                userName,
                isPublic || false,
                headPicture || "http://www.skyler.fun/robotDefaultImage.webp",
            ],
        );

        return NextResponse.json(
            {
                success: true,
                message: "智能体创建成功",
                data: {
                    intelligentAgentName,
                    userName,
                    isPublic: isPublic || false,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("创建智能体时出错:", error);
        return NextResponse.json(
            {
                success: false,
                message: "创建智能体失败，请稍后重试",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 },
        );
    }
}
