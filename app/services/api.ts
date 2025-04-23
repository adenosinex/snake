import { DatabaseResult } from '../types';

export const saveData = async (data: string): Promise<DatabaseResult> => {
  const response = await fetch('/api/database', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, createdAt: new Date().toISOString() }),
  });
  return response.json();
};

export const fetchData = async (): Promise<DatabaseResult[]> => {
  const response = await fetch('/api/database');
  return response.json();
};

export const deleteData = async (id: number): Promise<void> => {
  const response = await fetch(`/api/database?id=${id}`, {
    method: 'DELETE',
  });
  return response.json();
};