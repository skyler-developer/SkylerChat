import { NextRequest, NextResponse } from "next/server";
import { db } from "../../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { intelligentAgentName } = await request.json();

        // 验证必填字段
        if (!intelligentAgentName) {
            return NextResponse.json(
                {
                    success: false,
                    message: "智能体名称是必填项",
                },
                { status: 400 },
            );
        }

        // 查询智能体信息
        const [agents]: any = await db.query(
            "SELECT * FROM intelligentAgentInfo WHERE intelligentAgentName = ?",
            [intelligentAgentName],
        );

        if (agents.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "未找到指定的智能体",
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "获取智能体信息成功",
                data: agents[0],
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("获取智能体信息时出错:", error);
        return NextResponse.json(
            {
                success: false,
                message: "获取智能体信息失败，请稍后重试",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 },
        );
    }
}
