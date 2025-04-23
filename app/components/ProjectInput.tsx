import type{ ProjectInput, ProjectInputs } from '../types';

interface ProjectInputProps {
  project: string;
  input: ProjectInput;
  onChange: (project: string, updates: Partial<ProjectInput>) => void;
}

export default function ProjectInput({ project, input, onChange }: ProjectInputProps) {
  return (
    <div className="flex flex-col gap-2 border p-4 rounded shadow-md bg-white w-full">
      <h3 className="font-semibold text-center text-lg">{project}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="w-24 text-right text-sm">次数:</label>
          <input
            type="number"
            className="border p-2 rounded flex-1 text-sm"
            placeholder={`输入${project}次数`}
            value={input.count}
            onChange={(e) => onChange(project, { 
              count: e.target.value ? Number(e.target.value) : "" 
            })}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24 text-right text-sm">描述1:</label>
          <input
            type="text"
            className="border p-2 rounded flex-1 text-sm"
            placeholder={`输入${project}描述1`}
            value={input.description1}
            onChange={(e) => onChange(project, { description1: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24 text-right text-sm">描述2:</label>
          <input
            type="text"
            className="border p-2 rounded flex-1 text-sm"
            placeholder={`输入${project}描述2`}
            value={input.description2}
            onChange={(e) => onChange(project, { description2: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}