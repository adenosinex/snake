export type DatabaseResult = {
  id: number;
  data: string;
  createdAt: string;
};

export interface ProjectInput {
  counts: string[];
}

export interface ProjectInputs {
  [key: string]: ProjectInput;
}