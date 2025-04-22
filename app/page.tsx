"use client";

import { useState } from "react";

export default function Home() {
  // 定义一个状态变量 projects，用于存储所有的项目名称
  const [projects, setProjects] = useState<string[]>(["双力臂", "引体", "双杠臂屈伸", "悬垂举腿", "吊杠30s"]);

  // 定义一个状态变量 projectInputs，用于存储每个项目的输入内容
  const [projectInputs, setProjectInputs] = useState<{
    [key: string]: { count: number | ""; description1: string; description2: string };
  }>(
    // 初始化每个项目的输入内容为空
    projects.reduce((acc, project) => {
      acc[project] = { count: "", description1: "", description2: "" };
      return acc;
    }, {} as { [key: string]: { count: number | ""; description1: string; description2: string } })
  );

  // 定义一个状态变量 currentOutput，用于存储当前的输出结果
  const [currentOutput, setCurrentOutput] = useState<string>("");

  // 点击“添加”按钮时调用的函数
  const handleAddEntry = () => {
    const newEntries = Object.entries(projectInputs) // 将 projectInputs 转换为数组，便于遍历
      .filter(([_, inputs]) => inputs.count !== "" || inputs.description1 || inputs.description2) // 过滤掉没有输入内容的项目
      .map(([project, inputs]) => {
        // 构建输出字符串，忽略空值
        const parts = [
          project, // 项目名称
          inputs.count !== "" ? inputs.count : null, // 次数（如果为空则忽略）
          inputs.description1 || null, // 描述1（如果为空则忽略）
          inputs.description2 || null, // 描述2（如果为空则忽略）
        ].filter(Boolean); // 过滤掉 null 或 undefined
        return parts.join(" "); // 将有效部分用空格拼接成字符串
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
        {/* 页面标题 */}
        <h1 className="text-2xl font-bold">在线字符生成模块</h1>
        <div className="flex flex-wrap gap-8 items-start">
          {/* 遍历项目列表，为每个项目生成 3 个输入框 */}
          {projects.map((project) => (
            <div key={project} className="flex flex-col gap-2 border p-4 rounded shadow-md">
              <h3 className="font-semibold text-center">{project}</h3>
              <div className="flex items-center gap-2">
                <label className="w-24 text-right">次数:</label>
                <input
                  type="number" // 输入框类型为数字
                  className="border p-2 rounded flex-1"
                  placeholder={`输入${project}次数`} // 提示用户输入次数
                  value={projectInputs[project].count} // 绑定输入框的值
                  onChange={(e) =>
                    setProjectInputs({
                      ...projectInputs, // 保留其他项目的值
                      [project]: {
                        ...projectInputs[project], // 保留当前项目的其他值
                        count: e.target.value ? Number(e.target.value) : "", // 更新次数
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-24 text-right">描述1:</label>
                <input
                  type="text" // 输入框类型为文本
                  className="border p-2 rounded flex-1"
                  placeholder={`输入${project}描述1`} // 提示用户输入描述1
                  value={projectInputs[project].description1} // 绑定输入框的值
                  onChange={(e) =>
                    setProjectInputs({
                      ...projectInputs,
                      [project]: {
                        ...projectInputs[project],
                        description1: e.target.value, // 更新描述1
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-24 text-right">描述2:</label>
                <input
                  type="text" // 输入框类型为文本
                  className="border p-2 rounded flex-1"
                  placeholder={`输入${project}描述2`} // 提示用户输入描述2
                  value={projectInputs[project].description2} // 绑定输入框的值
                  onChange={(e) =>
                    setProjectInputs({
                      ...projectInputs,
                      [project]: {
                        ...projectInputs[project],
                        description2: e.target.value, // 更新描述2
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
          onClick={handleAddEntry} // 点击时调用 handleAddEntry 函数
        >
          添加
        </button>
        {/* 显示结果区域 */}
        <div className="w-full max-w-md">
          <h2 className="text-lg font-semibold">生成结果:</h2>
          <ul className="list-disc pl-5">
            {currentOutput && <li>{today} {currentOutput}</li>} {/* 显示当前输出结果 */}
          </ul>
        </div>
      </main>
    </div>
  );
}



