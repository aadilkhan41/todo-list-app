import axios, { isCancel } from "axios";
import type { ApiResponse, ApiSuccessBody, TasksApi } from "../types/api";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";
import { ApiClientError } from "./ApiClientError";

const BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export const http = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => (status >= 200 && status < 300) || status === 204,
});

http.interceptors.response.use(
  (response) => {
    if (response.status === 204) return response;

    const body = response.data as ApiResponse<unknown> | undefined;
    if (body && typeof body === "object" && "success" in body && !body.success) {
      return Promise.reject(ApiClientError.fromResponse(response.status, body));
    }
    return response;
  },
  (error) => {
    if (isCancel(error)) return Promise.reject(error);
    return Promise.reject(ApiClientError.fromUnknown(error));
  },
);

async function request<T>(
  method: "get" | "post" | "patch" | "delete",
  url: string,
  { data, signal }: { data?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const response = await http.request<ApiSuccessBody<T>>({ method, url, data, signal });
  if (response.status === 204) return null as T;
  return response.data.data;
}

export const api: TasksApi = {
  list: (signal) => request<Task[]>("get", "/tasks", { signal }),
  create: (task: CreateTaskInput, signal) => request<Task>("post", "/tasks", { data: task, signal }),
  update: (id: string, patch: UpdateTaskInput, signal) =>
    request<Task>("patch", `/tasks/${id}`, { data: patch, signal }),
  toggle: (id: string, signal) => request<Task>("patch", `/tasks/${id}/toggle`, { signal }),
  remove: (id: string, signal) => request<null>("delete", `/tasks/${id}`, { signal }),
};
