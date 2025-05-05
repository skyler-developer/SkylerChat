import { NextRequest } from "next/server";
import { db } from "../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { sessionId } = await request.json();
        if (!sessionId) {
            return new Response(JSON.stringify({ success: false, message: "缺少sessionId" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        // 删除数据库中的会话
        const [result] = await db.query("DELETE FROM sessionrecords WHERE sessionId = ?", [
            sessionId,
        ]);
        const affectedRows = (result as any).affectedRows;
        // 判断是否删除成功
        if (affectedRows > 0) {
            return new Response(JSON.stringify({ success: true, message: "删除成功" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: "未找到对应会话" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("删除会话出错:", error);
        return new Response(JSON.stringify({ success: false, message: "服务器错误" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
