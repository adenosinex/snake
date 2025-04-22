"use client";

import { useState } from "react";

export default function Home() {
  // 定义一个状态变量 projects，用于存储所有的项目名称
  const [projects, setProjects] = useState<string[]>(["pull", "push", "squat"]);

  // 定义一个状态变量 projectInputs，用于存储每个项目的输入内容
  const [projectInputs, setProjectInputs] = useState<{
    [key: string]: { count: number | ""; description1: string; description2: string };
  }>(
    projects.reduce((acc, project) => {
      acc[project] = { count: "", description1: "", description2: "" };
      return acc;
    }, {} as { [key: string]: { count: number | ""; description1: string; description2: string } })
  );

  // 定义一个状态变量 currentOutput，用于存储当前的输出结果
  const [currentOutput, setCurrentOutput] = useState<string>("");

  // 点击“添加”按钮时调用的函数
  const handleAddEntry = () => {
    const newEntries = Object.entries(projectInputs)
      .filter(([_, inputs]) => inputs.count !== "" || inputs.description1 || inputs.description2) // 过滤掉没有输入内容的项目
      .map(([project, inputs]) => {
        // 构建输出字符串，忽略空值
        const parts = [
          project,
          inputs.count !== "" ? inputs.count : null,
          inputs.description1 || null,
          inputs.description2 || null,
        ].filter(Boolean); // 过滤掉 null 或 undefined
        return parts.join(" ");
      });

    if (newEntries.length > 0) {
      // 更新当前输出结果
      setCurrentOutput(newEntries.join(" "));
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
        <div className="flex flex-wrap gap-8 items-start">
          {/* 遍历项目列表，为每个项目生成 3 个输入框 */}
          {projects.map((project) => (
            <div key={project} className="flex flex-col gap-2 border p-4 rounded shadow-md">
              <h3 className="font-semibold text-center">{project}</h3>
              <div className="flex items-center gap-2">
                <label className="w-24 text-right">次数:</label>
                <input
                  type="number"
                  className="border p-2 rounded flex-1"
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
                <label className="w-24 text-right">描述1:</label>
                <input
                  type="text"
                  className="border p-2 rounded flex-1"
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
                <label className="w-24 text-right">描述2:</label>
                <input
                  type="text"
                  className="border p-2 rounded flex-1"
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
          ))}
        </div>
        {/* 添加按钮 */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddEntry}
        >
          添加
        </button>
        {/* 显示结果区域 */}
        <div className="w-full max-w-md">
          <h2 className="text-lg font-semibold">生成结果:</h2>
          <ul className="list-disc pl-5">
            {currentOutput && <li>{today} {currentOutput}</li>}
          </ul>
        </div>
      </main>
    </div>
  );
}



