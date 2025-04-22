"use client";

import { useState } from "react";

export default function Home() {
  // 定义一个状态变量 projects，用于存储所有的项目名称
  const [projects, setProjects] = useState<string[]>(["pull", "push"]);

  // 定义一个状态变量 projectInputs，用于存储每个项目的输入内容
  const [projectInputs, setProjectInputs] = useState<{
    [key: string]: { count: number | ""; description1: string; description2: string };
  }>(
    projects.reduce((acc, project) => {
      acc[project] = { count: "", description1: "", description2: "" };
      return acc;
    }, {} as { [key: string]: { count: number | ""; description1: string; description2: string } })
  );

  // 定义一个状态变量 entries，用于存储所有提交的结果
  const [entries, setEntries] = useState<{
    project: string;
    count: number;
    description1: string;
    description2: string;
  }[]>([]);

  // 点击“添加”按钮时调用的函数
  const handleAddEntry = () => {
    const newEntries = Object.entries(projectInputs)
      .filter(([_, inputs]) => inputs.count !== "" || inputs.description1 || inputs.description2) // 过滤掉没有输入内容的项目
      .map(([project, inputs]) => ({
        project,
        count: Number(inputs.count) || 0,
        description1: inputs.description1,
        description2: inputs.description2,
      }));

    if (newEntries.length > 0) {
      setEntries([...entries, ...newEntries]); // 将新条目添加到结果中
      // 清空输入框
      setProjectInputs(
        projects.reduce((acc, project) => {
          acc[project] = { count: "", description1: "", description2: "" };
          return acc;
        }, {} as { [key: string]: { count: number | ""; description1: string; description2: string } })
      );
    }
  };

  // 获取当前日期，格式为“年-月-日”
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="min-h-screen p-8 pb-20">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">在线字符生成模块</h1>
        <div className="flex flex-col gap-4 items-center">
          {/* 输入区域 */}
          <div className="flex flex-col gap-4">
            {/* 遍历项目列表，为每个项目生成 3 个输入框 */}
            {projects.map((project) => (
              <div key={project} className="flex flex-col gap-2">
                <h3 className="font-semibold">{project}:</h3>
                <input
                  type="number"
                  className="border p-2 rounded"
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
                <input
                  type="text"
                  className="border p-2 rounded"
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
                <input
                  type="text"
                  className="border p-2 rounded"
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
            ))}
            {/* 添加按钮 */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAddEntry}
            >
              添加
            </button>
          </div>
          {/* 显示结果区域 */}
          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold">生成结果:</h2>
            <ul className="list-disc pl-5">
              {entries.length > 0 && (
                <li>
                  {today}{" "}
                  {entries
                    .map(
                      (entry) =>
                        `${entry.project} ${entry.count} ${entry.description1} ${entry.description2}`
                    )
                    .join(" ")}
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}



