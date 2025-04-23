import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_aGt9spe8FIHT@ep-noisy-bonus-a102iht5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

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

export async function POST(request: Request) {
  const { data, createdAt } = await request.json();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const result = await pool.query(
      "INSERT INTO results (data, created_at) VALUES ($1, $2) RETURNING id, data, created_at as \"createdAt\"",
      [data, createdAt]
    );
    
    return NextResponse.json({ 
      message: "数据已保存",
      id: result.rows[0].id,
      data: result.rows[0].data,
      createdAt: result.rows[0].createdAt
    });
  } catch (err) {
    console.error("保存数据时出错:", err);
    return NextResponse.json({ error: "保存数据时出错" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
  }

  try {
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