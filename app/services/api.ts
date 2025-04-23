import { DatabaseResult } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const saveData = async (data: string): Promise<DatabaseResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        data,
        createdAt: new Date().toLocaleString()
      }),
    });

    if (!response.ok) {
      throw new Error('保存失败');
    }

    return response.json();
  } catch (error) {
    console.error('保存数据时出错:', error);
    throw error;
  }
};

export const fetchData = async (): Promise<DatabaseResult[]> => {
  const response = await fetch(`${API_BASE_URL}/api/database`);
  if (!response.ok) {
    throw new Error('获取数据失败');
  }
  return response.json();
};

export const deleteData = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/database?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error('删除失败');
  }
};