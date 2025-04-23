"use client";

import { useState, useEffect } from "react";
import { DatabaseResult, ProjectInputs } from './types';
import { saveData, fetchData, deleteData } from './services/api';
import ProjectInput from './components/ProjectInput';
import DataDisplay from './components/DataDisplay';

const defaultProjects = process.env.NEXT_PUBLIC_PROJECTS
  ? process.env.NEXT_PUBLIC_PROJECTS.split(",")
  : ["a", "b"];

export default function Home() {
  const [projects, setProjects] = useState<string[]>(defaultProjects);
  const [projectInputs, setProjectInputs] = useState<ProjectInputs>(
    projects.reduce((acc, project) => {
      acc[project] = { count: "", description1: "", description2: "" };
      return acc;
    }, {} as ProjectInputs)
  );
  const [currentOutput, setCurrentOutput] = useState<string>("");
  const [databaseResults, setDatabaseResults] = useState<DatabaseResult[]>([]);

  const handleInputChange = (project: string, updates: Partial<ProjectInputs[string]>) => {
    setProjectInputs(prev => ({
      ...prev,
      [project]: { ...prev[project], ...updates }
    }));
  };

  const saveToDatabase = async (data: string) => {
    const tempId = Date.now();
    const now = new Date().toISOString();

    try {
      // 先保存到数据库
      const result = await saveData(data);
      console.log('保存结果:', result);

      // 更新前端数据
      setDatabaseResults(prev => [
        {
          id: result.id,
          data: data,
          createdAt: result.createdAt || now
        },
        ...prev
      ]);

    } catch (err) {
      console.error("保存数据时出错:", err);
    }
  };

  const fetchResults = async () => {
    try {
      const data = await fetchData();
      console.log("数据库中的数据:", data);
      setDatabaseResults(data);
    } catch (err) {
      console.error("获取数据时出错:", err);
    }
  };

  const deleteResult = async (id: number) => {
    setDatabaseResults((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await deleteData(id);
      // const result = await response.json();
      // console.log(result.message);
    } catch (err) {
      console.error("删除数据时出错:", err);
      fetchResults();
    }
  };

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
      const output = today +" "+ newEntries.join(" ");
      console.log("生成的结果:", output);
      setCurrentOutput(output);
      await saveToDatabase(output);
    }
  };

  useEffect(() => {
    const fetchAndUpdateResults = async () => {
      try {
        const data = await fetchData();
        setDatabaseResults(data);
      } catch (err) {
        console.error("获取数据时出错:", err);
      }
    };

    // 初始加载
    fetchAndUpdateResults();

    // 设置定期刷新（可选）
    const intervalId = setInterval(fetchAndUpdateResults, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
            <ProjectInput
              key={project}
              project={project}
              input={projectInputs[project]}
              onChange={handleInputChange}
            />
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
                onClick={() => handleCopy(currentOutput)}
              >
                {currentOutput}（点击复制）
              </li>
            )}
          </ul>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-4">数据库中的数据:</h2>
          <div className="space-y-3">
            {databaseResults.map((item, index) => (
              <DataDisplay
                key={`${item.id}-${index}`}
                item={item}
                onCopy={handleCopy}
                onDelete={deleteResult}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}



