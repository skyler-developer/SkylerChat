import { db } from "../router";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    console.log("Received registration request:", { username, password });
    // 检查请求体是否包含用户名和密码
    console.log("Username:", username, "Password:", password);

    if (!username || !password) {
        return NextResponse.json(
            { message: "Username and password are required." },
            { status: 400 },
        );
    }

    try {
        // 检查用户是否已存在
        const [rows]: any = await db.query("SELECT * FROM userinfo WHERE username = ?", [username]);
        if (rows.length > 0) {
            return NextResponse.json({ message: "User already exists." }, { status: 409 });
        }
        // 插入新用户
        await db.query("INSERT INTO userinfo (username, password) VALUES (?, ?)", [
            username,
            password,
        ]);
        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Database error.", error }, { status: 500 });
    }
}
