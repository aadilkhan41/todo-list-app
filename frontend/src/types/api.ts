import type { CreateTaskInput, Task, UpdateTaskInput } from "./task";

export type ApiErrorBody = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

export type ApiResponse<T> = ApiSuccessBody<T> | ApiErrorBody;

export type TasksApi = {
  list: (signal?: AbortSignal) => Promise<Task[]>;
  create: (task: CreateTaskInput, signal?: AbortSignal) => Promise<Task>;
  update: (id: string, patch: UpdateTaskInput, signal?: AbortSignal) => Promise<Task>;
  toggle: (id: string, signal?: AbortSignal) => Promise<Task>;
  remove: (id: string, signal?: AbortSignal) => Promise<null>;
};
