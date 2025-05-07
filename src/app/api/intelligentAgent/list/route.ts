import { NextRequest, NextResponse } from "next/server";
import { db } from "../../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { userName } = await request.json();

        let query = "";
        let params: any[] = [];

        if (userName) {
            // 如果有userName，查询公开智能体和用户创建的智能体
            query = `SELECT * FROM intelligentAgentInfo 
                    WHERE isPublic = true 
                    OR userName = ? 
                    ORDER BY userName = ? DESC, intelligentAgentName ASC`;
            params = [userName, userName];
        } else {
            // 如果没有userName，只查询公开智能体
            query = `SELECT * FROM intelligentAgentInfo 
                    WHERE isPublic = true 
                    ORDER BY intelligentAgentName ASC`;
        }

        const [agents]: any = await db.query(query, params);

        return NextResponse.json(
            {
                success: true,
                message: "获取智能体列表成功",
                data: agents,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("获取智能体列表时出错:", error);
        return NextResponse.json(
            {
                success: false,
                message: "获取智能体列表失败，请稍后重试",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 },
        );
    }
}
