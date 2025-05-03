import { db } from "../router";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const { userName, passWord, token } = await request.json();
        // 检查请求体中是否有 token
        if (token) {
            try {
                // 验证 token
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
                // 根据 token 中的 userName 查询用户信息
                const [rows] = await db.query("SELECT * FROM userinfo WHERE username = ?", [
                    decoded.userName,
                ]);
                const users = rows as any[];
                if (Array.isArray(users) && users.length > 0) {
                    const user = users[0];
                    // 返回用户信息
                    return new Response(JSON.stringify({ success: true, user }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                } else {
                    return new Response(JSON.stringify({ success: false, message: "用户不存在" }), {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            } catch (err) {
                return new Response(
                    JSON.stringify({ success: false, message: "token无效或已过期" }),
                    {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
        }
        // 查询用户信息（不查密码）
        const [rows] = await db.query("SELECT * FROM userinfo WHERE username = ?", [userName]);
        // 明确断言 rows 为 RowDataPacket[]
        const users = rows as any[];
        if (Array.isArray(users) && users.length > 0) {
            const user = users[0];
            // 用 bcrypt 验证密码
            const isMatch = await bcrypt.compare(passWord, user.password);
            if (isMatch) {
                // 生成 token，payload 可根据需要添加更多字段
                const token = jwt.sign({ userName: user.username, uuid: user.uuid }, "skyler", {
                    expiresIn: "7d",
                });
                return new Response(JSON.stringify({ success: true, user, token }), {
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
