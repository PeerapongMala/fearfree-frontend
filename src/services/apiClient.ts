import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth.store";

// 1. configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
// Turn this to true to use mock data instead of real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// 2. Axios Instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2.5. Axios Interceptor for Authorization
apiClient.interceptors.request.use(
  (config) => {
    // Read token from Zustand store directly
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Helper to handle mock vs real api
export const requestApi = async <T>(
  config: AxiosRequestConfig,
  mockData?: T
): Promise<AxiosResponse<T>> => {
  if (USE_MOCK && mockData !== undefined) {
    console.log(`[MOCK API] ${config.method?.toUpperCase()} ${config.url}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: config as any,
    };
  }

  // Use Real API
  return apiClient.request<T>(config);
};

export default apiClient;
