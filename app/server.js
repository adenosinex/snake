import express from "express";
import pkg from 'pg';
const { Pool } = pkg;
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const app = express();
const port = process.env.PORT || 3001;
 

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_aGt9spe8FIHT@ep-noisy-bonus-a102iht5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());

// 统一的路由路径
const router = express.Router();

// 保存数据
router.post("/database", async (req, res) => {
  const { data, createdAt } = req.body;
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
    
    res.status(200).json({ 
      message: "数据已保存",
      id: result.rows[0].id,
      data: result.rows[0].data,
      createdAt: result.rows[0].createdAt
    });
  } catch (err) {
    console.error("保存数据时出错:", err);
    res.status(500).json({ error: "保存数据时出错" });
  }
});

// 获取数据
router.get("/database", async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT id, data, created_at as \"createdAt\" FROM results ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("获取数据时出错:", err);
    res.status(500).json({ error: "获取数据时出错" });
  }
});
// 获取数据
router.get("/", async (_, res) => {
  try {
  
    res.status(200).json("ok");
  } catch (err) {
    console.error("获取数据时出错:", err);
    res.status(500).json({ error: "获取数据时出错" });
  }
});

// 删除数据
router.delete("/database", async (req, res) => {
  const id = req.query.id;
  
  if (!id) {
    return res.status(400).json({ error: "缺少 id 参数" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM results WHERE id = $1 RETURNING id",
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "数据不存在" });
    }
    
    res.status(200).json({ message: "删除成功" });
  } catch (err) {
    console.error("删除数据时出错:", err);
    res.status(500).json({ error: "删除数据时出错" });
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});