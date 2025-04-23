import   { formatLocalTime } from '../utils/dateFormat';

interface DataDisplayProps {
  item: {     
    id: number;
    data: string;
    createdAt: string;
  };
  onCopy: (text: string) => void;
  onDelete: (id: number) => void;
}

export default function DataDisplay({ item, onCopy, onDelete }: DataDisplayProps) {
  return (
    <div className="group relative flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
      <div className="flex-1 cursor-pointer" onClick={() => onCopy(item.data)}>
        <p className="text-gray-800 break-words">{item.data}</p>
        <p className="text-sm text-gray-500 mt-1">
          {formatLocalTime(item.createdAt)}
        </p>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="ml-4 p-2 text-red-500 hover:text-red-700"
      >
        删除
      </button>
    </div>
  );
}