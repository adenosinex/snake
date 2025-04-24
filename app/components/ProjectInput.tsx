import type { ProjectInput } from '../types';
import { useState } from 'react';

interface ProjectInputProps {
  project: string;
  input: ProjectInput;
  onChange: (project: string, updates: Partial<ProjectInput>) => void;
}

export default function ProjectInput({ project, input, onChange }: ProjectInputProps) {
  const [inputCount] = useState(1); // 设置默认2个输入框

  const handleCountChange = (index: number, value: string) => {
    const newCounts = [...(input.counts || [])];
    newCounts[index] = value;
    onChange(project, { counts: newCounts });
  };

  return (
    <div className="flex flex-col gap-2 border p-4 rounded shadow-md bg-white w-full">
      <h3 className="font-semibold text-center text-lg">{project}</h3>
      <div className="flex flex-col gap-2">
        {Array(inputCount).fill(0).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <label className="w-24 text-right text-sm">次数 {index + 1}:</label>
            <input
              type="text"
              className="border p-2 rounded flex-1 text-sm"
              placeholder={`输入${project}次数 ${index + 1}`}
              value={input.counts?.[index] || ''}
              onChange={(e) => handleCountChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}