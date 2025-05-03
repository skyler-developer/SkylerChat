import { db } from "./router";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const { userName, passWord } = await request.json();
        // 查询用户信息（不查密码）
        const [rows] = await db.query("SELECT * FROM userinfo WHERE username = ?", [userName]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            // 用 bcrypt 验证密码
            const isMatch = await bcrypt.compare(passWord, user.password);
            if (isMatch) {
                return new Response(JSON.stringify({ success: true, user }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        return new Response(JSON.stringify({ success: false, message: "用户名或密码错误" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "服务器错误" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
