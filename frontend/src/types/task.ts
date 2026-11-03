export type Priority = "" | "Low" | "Medium" | "High";
export type DateString = string;
export type TimeString = string;

export interface Task {
  id: string;
  title: string;
  desc: string;
  date: DateString;
  start: TimeString;
  end: TimeString | "";
  pri: Priority;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTaskInput = {
  title: string;
  desc: string;
  date: DateString;
  start: TimeString;
  end: TimeString | "";
  pri: Priority;
};

export type UpdateTaskInput = Partial<CreateTaskInput & { done: boolean }>;
export type TaskFormValues = CreateTaskInput;

export type TaskModalState = {
  task?: Task;
  date: DateString;
};
