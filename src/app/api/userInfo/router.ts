import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "skylerchatsql",
});

// 测试数据库连接
db.getConnection()
    .then((conn) => {
        console.log("数据库连接成功");
        conn.release();
    })
    .catch((err) => {
        console.error("数据库连接失败", err);
    });
