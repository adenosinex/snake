import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM results ORDER BY id ASC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("获取数据时出错:", err);
    return NextResponse.json({ error: "获取数据时出错" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { data } = await req.json();
    await pool.query("CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, data TEXT)");
    await pool.query("INSERT INTO results (data) VALUES ($1)", [data]);
    return NextResponse.json({ message: "数据已保存" });
  } catch (err) {
    console.error("保存数据时出错:", err);
    return NextResponse.json({ error: "保存数据时出错" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
  }

  try {
    const result = await pool.query("DELETE FROM results WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      return NextResponse.json({ message: "数据已删除" });
    } else {
      return NextResponse.json({ error: "数据未找到" }, { status: 404 });
    }
  } catch (err) {
    console.error("删除数据时出错:", err);
    return NextResponse.json({ error: "删除数据时出错" }, { status: 500 });
  }
}