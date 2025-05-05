import { db } from "../router";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    const { username, oldPassword, newPassword } = await req.json();
    if (!username || !oldPassword || !newPassword) {
        return NextResponse.json(
            { message: "用户名、旧密码和新密码均为必填项。" },
            { status: 400 },
        );
    }
    try {
        // 查询用户是否存在
        const [rows]: any = await db.query("SELECT * FROM userinfo WHERE username = ?", [username]);
        if (rows.length === 0) {
            return NextResponse.json({ message: "用户不存在。" }, { status: 404 });
        }
        const user = rows[0];
        // 校验旧密码
        const isMatch = await bcrypt.compare(oldPassword, user.password || user.passWord);
        if (!isMatch) {
            return NextResponse.json({ message: "旧密码错误。" }, { status: 401 });
        }
        // 加密新密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // 更新密码
        await db.query("UPDATE userinfo SET password = ? WHERE username = ?", [
            hashedPassword,
            username,
        ]);
        return NextResponse.json({ message: "密码修改成功。" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "服务器错误。", error }, { status: 500 });
    }
}
