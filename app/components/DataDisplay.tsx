import { DatabaseResult } from '../types';

interface DataDisplayProps {
  item: DatabaseResult;
  onCopy: (text: string) => void;
  onDelete: (id: number) => void;
}

export default function DataDisplay({ item, onCopy, onDelete }: DataDisplayProps) {
  // 解析数据内容
  const displayData = (() => {
    try {
      // 如果是JSON字符串，尝试解析
      if (typeof item.data === 'string' && item.data.startsWith('{')) {
        const parsed = JSON.parse(item.data);
        return parsed.data || item.data;
      }
      return item.data;
    } catch (e) {
      console.error('数据解析错误:', e);
      return item.data;
    }
  })();

 

  // 格式化时间
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('时间格式化错误:', error);
      return '时间格式错误';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
      <div className="flex-1 mr-4">
        <div className="flex flex-col">
          <span
            className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => onCopy(displayData)}
          >
            {displayData}
            <span className="text-sm text-gray-500 ml-2">（点击复制）</span>
          </span>
          <span className="text-xs text-gray-400 mt-1">
            创建时间：{formatDate(item.createdAt)}
          </span>
        </div>
      </div>
      <button
        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 
                   transition-colors duration-200 flex items-center space-x-1 text-sm"
        onClick={() => onDelete(item.id)}
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
  );
}