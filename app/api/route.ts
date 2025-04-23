import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 创建数据库连接池
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// 创建表的函数
async function ensureTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error("创建表时出错:", err);
  }
}

// 确保表存在
ensureTable();

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, data, created_at as \"createdAt\" FROM results ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("获取数据时出错:", err);
    return NextResponse.json({ error: "获取数据时出错" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    const result = await pool.query(
      "INSERT INTO results (data) VALUES ($1) RETURNING id, data, created_at as \"createdAt\"",
      [data]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("保存数据时出错:", err);
    return NextResponse.json({ error: "保存数据时出错" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM results WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "数据不存在" }, { status: 404 });
    }

    return NextResponse.json({ message: "删除成功" });
  } catch (err) {
    console.error("删除数据时出错:", err);
    return NextResponse.json({ error: "删除数据时出错" }, { status: 500 });
  }
}