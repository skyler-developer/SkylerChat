import { NextRequest } from "next/server";
import { db } from "../../userInfo/router";

export async function POST(request: NextRequest) {
    const { userName } = await request.json();

    let rows;
    try {
        // 查询 sessionrecords 表
        [rows] = await db.query(
            "SELECT * FROM sessionrecords WHERE userName = ? ORDER BY timeStamp DESC",
            [userName],
        );
        // console.log("Session Records:", rows);
    } catch (dbError) {
        console.error("Database query error:", dbError);
        return new Response(JSON.stringify({ error: "数据库查询出错" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (rows.length === 0) {
        return new Response(JSON.stringify({ success: false, msg: "没有找到相关记录" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return new Response(JSON.stringify({ success: true, msg: rows }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
