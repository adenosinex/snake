"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 从环境变量中获取项目列表
const defaultProjects = process.env.NEXT_PUBLIC_PROJECTS
  ? process.env.NEXT_PUBLIC_PROJECTS.split(",")
  : ["a", "b"]; // 如果环境变量未设置，使用默认值

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
  const [databaseResults, setDatabaseResults] = useState<{ id: number; data: string }[]>([]);

  // 保存数据到数据库
  const saveToDatabase = async (data: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      console.log(result.message);
      fetchResults(); // 保存后重新加载数据
    } catch (err) {
      console.error("保存数据时出错:", err);
    }
  };

  // 获取所有数据
  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/results`);
      const data = await response.json();
      console.log("数据库中的数据:", data);
      setDatabaseResults(data); // 更新数据库结果到状态
    } catch (err) {
      console.error("获取数据时出错:", err);
    }
  };

  // 删除单条数据
  const deleteResult = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/results/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      console.log(result.message);
      fetchResults(); // 删除后重新加载数据
    } catch (err) {
      console.error("删除数据时出错:", err);
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
          <h2 className="text-lg font-semibold">数据库中的数据:</h2>
          <ul className="list-disc pl-5">
            {databaseResults.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm">
                <span
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleCopy(item.data)}
                >
                  {item.data}（点击复制）
                </span>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => deleteResult(item.id)}
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}



