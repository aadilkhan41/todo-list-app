import { isAxiosError, isCancel } from "axios";
import type { ApiErrorBody } from "../types/api";

export type SerializableError = {
  status: number;
  code: string;
  message: string;
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }

  get isNotFound(): boolean {
    return this.status === 404 || this.code === "NOT_FOUND";
  }

  get isNetwork(): boolean {
    return this.status === 0 || this.code === "NETWORK_ERROR";
  }

  get userMessage(): string {
    if (this.isNetwork) return "Can't reach the server. Check your connection.";
    if (this.isNotFound) return "That item was not found.";
    return this.message;
  }

  toJSON(): SerializableError {
    return { status: this.status, code: this.code, message: this.message };
  }

  static fromResponse(status: number, body: unknown): ApiClientError {
    const err =
      body && typeof body === "object" && "success" in body && !(body as ApiErrorBody).success
        ? (body as ApiErrorBody).error
        : undefined;

    return new ApiClientError(
      status,
      err?.code || "REQUEST_FAILED",
      err?.message || `Request failed (${status})`,
    );
  }

  static fromUnknown(error: unknown, fallback = "Request failed"): ApiClientError {
    if (error instanceof ApiClientError) return error;

    if (isAxiosError(error)) {
      if (!error.response) {
        return new ApiClientError(0, "NETWORK_ERROR", "Network request failed");
      }
      return ApiClientError.fromResponse(error.response.status, error.response.data);
    }

    if (isSerializableError(error)) {
      return new ApiClientError(error.status, error.code, error.message);
    }

    if (error instanceof Error) {
      return new ApiClientError(0, "UNKNOWN", error.message || fallback);
    }

    return new ApiClientError(0, "UNKNOWN", fallback);
  }
}

export function isApiClientError(e: unknown): e is ApiClientError {
  return e instanceof ApiClientError;
}

export function isSerializableError(e: unknown): e is SerializableError {
  return Boolean(
    e &&
      typeof e === "object" &&
      "status" in e &&
      "code" in e &&
      "message" in e &&
      typeof (e as SerializableError).code === "string",
  );
}

export function isAbortError(e: unknown): boolean {
  if (isCancel(e)) return true;
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    (e instanceof Error && (e.name === "AbortError" || e.name === "CanceledError")) ||
    (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "ERR_CANCELED")
  );
}

export function toSerializableError(error: unknown, fallback = "Request failed"): SerializableError {
  return ApiClientError.fromUnknown(error, fallback).toJSON();
}

export function toErrorMessage(error: unknown, fallback = "Request failed"): string {
  return ApiClientError.fromUnknown(error, fallback).userMessage;
}
