import { DatabaseResult } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const saveData = async (data: string): Promise<DatabaseResult> => {
  try {
    const newData = {
      data: data,
      createdAt: new Date().toLocaleString()
    };

    const response = await fetch(`${API_BASE_URL}/api/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error('保存失败');
    }

    const result = await response.json();
    console.log('API 返回结果:', result);

    return {
      id: result.id,
      data: data, // 使用原始数据
      createdAt: result.createdAt || newData.createdAt
    };
  } catch (error) {
    console.error('保存数据时出错:', error);
    throw error;
  }
};

export const fetchData = async (): Promise<DatabaseResult[]> => {
  const response = await fetch(`${API_BASE_URL}/api/results`);
  if (!response.ok) {
    throw new Error('获取数据失败');
  }
  return response.json();
};

export const deleteData = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/results/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '删除失败' }));
      throw new Error(errorData.error || '删除失败');
    }
  } catch (error) {
    console.error('删除数据时出错:', error);
    throw error;
  }
};