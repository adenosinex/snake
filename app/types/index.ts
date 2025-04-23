export type DatabaseResult = {
  id: number;
  data: string;
  createdAt: string;
};

export type ProjectInput = {
  count: number | "";
  description1: string;
  description2: string;
};

export type ProjectInputs = {
  [key: string]: ProjectInput;
};