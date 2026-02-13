import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.detail) return data.detail;
    return error.message || "Request failed";
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

