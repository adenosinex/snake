"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 从环境变量中获取项目列表
const defaultProjects = process.env.NEXT_PUBLIC_PROJECTS
  ? process.env.NEXT_PUBLIC_PROJECTS.split(",")
  : ["a", "b"]; // 如果环境变量未设置，使用默认值

// 修改类型定义
type DatabaseResult = {
  id: number;
  data: string;
  created_at: string;
};

export default function Home() {
  const [projects, setProjects] = useState<string[]>(defaultProjects);
  const [projectInputs, setProjectInputs] = useState<{
    [key: string]: { count: number | ""; description1: string; description2: string };
  }>(
    projects.reduce((acc, project) => {
      acc[project] = { count: "", description1: "", description2: "" };
      return acc;
    }, {} as { [key: string]: { count: number | ""; description1: string; description2: string } })
  );
  const [currentOutput, setCurrentOutput] = useState<string>("");
  // 修改 useState 定义
  const [databaseResults, setDatabaseResults] = useState<DatabaseResult[]>([]);

  // 保存数据到数据库
  const saveToDatabase = async (data: string) => {
    const now = new Date().toLocaleString('zh-CN');
    const tempId = Date.now();
    // 前台立即更新
    setDatabaseResults((prev) => [{ 
      id: tempId, 
      data,
      created_at: now
    },...prev, ]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          data,
          created_at: now 
        }),
      });
      const result = await response.json();
      console.log(result.message);

      // 替换临时 ID 为实际数据库返回的 ID
      setDatabaseResults((prev) =>
        prev.map((item) =>
          item.id === tempId ? { 
            id: result.id, 
            data: item.data,
            created_at: item.created_at 
          } : item
        )
      );
    } catch (err) {
      console.error("保存数据时出错:", err);
      // 如果保存失败，移除临时数据
      setDatabaseResults((prev) => prev.filter((item) => item.id !== tempId));
    }
  };

  // 获取所有数据
  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/results`);
      let  data = await response.json();
      //  data = data.sort((a: DatabaseResult, b: DatabaseResult) => {
      //   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      // });
      console.log("数据库中的数据:", data);
      setDatabaseResults(data); // 更新数据库结果到状态
    } catch (err) {
      console.error("获取数据时出错:", err);
    }
  };

  // 删除单条数据
  const deleteResult = async (id: number) => {
    // 前台立即更新
    setDatabaseResults((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/api/results/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      console.log(result.message);
    } catch (err) {
      console.error("删除数据时出错:", err);
      // 如果删除失败，重新添加数据
      fetchResults(); // 或者手动恢复数据
    }
  };

  // 添加新条目
  const handleAddEntry = async () => {
    const newEntries = Object.entries(projectInputs)
      .filter(([_, inputs]) => inputs.count !== "" || inputs.description1 || inputs.description2)
      .map(([project, inputs]) => {
        const parts = [
          project,
          inputs.count !== "" ? inputs.count : null,
          inputs.description1 || null,
          inputs.description2 || null,
        ].filter(Boolean);
        return parts.join(" ");
      });

    if (newEntries.length > 0) {
      const output = today + newEntries.join(" ");
      console.log("生成的结果:", output);
      // 更新当前输出
      setCurrentOutput(output);

      // 保存到数据库
      await saveToDatabase(output);

    
    }
  };

  // 页面加载时自动获取数据
  useEffect(() => {
    fetchResults();
  }, []);

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 点击复制功能
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("已复制到剪贴板");
    });
  };

  return (
    <div className="min-h-screen p-4 pb-20 bg-gray-100">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-center">运动记录</h1>
        <div className="flex flex-col gap-4 w-full">
          {projects.map((project) => (
            <div
              key={project}
              className="flex flex-col gap-2 border p-4 rounded shadow-md bg-white w-full"
            >
              <h3 className="font-semibold text-center text-lg">{project}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-sm">次数:</label>
                  <input
                    type="number"
                    className="border p-2 rounded flex-1 text-sm"
                    placeholder={`输入${project}次数`}
                    value={projectInputs[project].count}
                    onChange={(e) =>
                      setProjectInputs({
                        ...projectInputs,
                        [project]: {
                          ...projectInputs[project],
                          count: e.target.value ? Number(e.target.value) : "",
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-sm">描述1:</label>
                  <input
                    type="text"
                    className="border p-2 rounded flex-1 text-sm"
                    placeholder={`输入${project}描述1`}
                    value={projectInputs[project].description1}
                    onChange={(e) =>
                      setProjectInputs({
                        ...projectInputs,
                        [project]: {
                          ...projectInputs[project],
                          description1: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-sm">描述2:</label>
                  <input
                    type="text"
                    className="border p-2 rounded flex-1 text-sm"
                    placeholder={`输入${project}描述2`}
                    value={projectInputs[project].description2}
                    onChange={(e) =>
                      setProjectInputs({
                        ...projectInputs,
                        [project]: {
                          ...projectInputs[project],
                          description2: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-sm"
          onClick={handleAddEntry}
        >
          添加
        </button>
        <div className="w-full">
          <h2 className="text-lg font-semibold">生成结果:</h2>
          <ul className="list-disc pl-5">
            {currentOutput && (
              <li
                className="cursor-pointer text-blue-500 hover:underline text-sm"
                onClick={() => handleCopy(   currentOutput  )}
              >
                {currentOutput }（点击复制）
              </li>
            )}
          </ul>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-4">数据库中的数据:</h2>
          <div className="space-y-3">
            {databaseResults.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex-1 mr-4">
                  <div className="flex flex-col">
                    <span
                      className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => handleCopy(item.data)}
                    >
                      {item.data}
                      <span className="text-sm text-gray-500 ml-2">（点击复制）</span>
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      创建时间：{item.created_at}
                    </span>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 
                     transition-colors duration-200 flex items-center space-x-1 text-sm"
                  onClick={() => deleteResult(item.id)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  <span>删除</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}



