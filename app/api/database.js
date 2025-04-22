const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 从环境变量获取数据库连接信息
  ssl: {
    rejectUnauthorized: false, // 允许使用 SSL 连接
  },
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    // 保存数据到数据库
    const { data } = req.body;
    try {
      await pool.query("CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, data TEXT)");
      await pool.query("INSERT INTO results (data) VALUES ($1)", [data]);
      res.status(200).json({ message: "数据已保存" });
    } catch (err) {
      console.error("保存数据时出错:", err);
      res.status(500).json({ error: "保存数据时出错" });
    }
  } else if (method === "GET") {
    // 获取所有数据
    try {
      const result = await pool.query("SELECT * FROM results ORDER BY id ASC");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("获取数据时出错:", err);
      res.status(500).json({ error: "获取数据时出错" });
    }
  } else if (method === "DELETE") {
    // 删除单条数据
    const { id } = req.query;
    try {
      const result = await pool.query("DELETE FROM results WHERE id = $1", [id]);
      if (result.rowCount > 0) {
        res.status(200).json({ message: "数据已删除" });
      } else {
        res.status(404).json({ error: "数据未找到" });
      }
    } catch (err) {
      console.error("删除数据时出错:", err);
      res.status(500).json({ error: "删除数据时出错" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}