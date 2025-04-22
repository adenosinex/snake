const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

// PostgreSQL 配置
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_aGt9spe8FIHT@ep-noisy-bonus-a102iht5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// 中间件
app.use(cors());
app.use(bodyParser.json());

// API 路由

// 保存数据到数据库
app.post("/api/save", async (req, res) => {
  const { data } = req.body;
  try {
    // 如果表不存在，则创建表
    await pool.query("CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, data TEXT)");
    // 插入数据
    await pool.query("INSERT INTO results (data) VALUES ($1)", [data]);
    res.status(200).json({ message: "数据已保存" });
  } catch (err) {
    console.error("保存数据时出错:", err);
    res.status(500).json({ error: "保存数据时出错" });
  }
});

// 获取所有数据
app.get("/api/results", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM results ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("获取数据时出错:", err);
    res.status(500).json({ error: "获取数据时出错" });
  }
});

// 删除单条数据
app.delete("/api/results/:id", async (req, res) => {
  const { id } = req.params;
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
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});