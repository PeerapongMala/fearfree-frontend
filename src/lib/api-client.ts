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

// 2.6. Axios Response Interceptor for 401 Unauthorized with Token Refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic on login/register pages
    const isLoginPage =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/login") ||
        window.location.pathname === "/register");

    if (error.response?.status === 401 && !isLoginPage && !originalRequest._retry) {
      const storedRefreshToken = useAuthStore.getState().refreshToken;

      // No refresh token available - logout immediately
      if (!storedRefreshToken) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Set flag synchronously before any await to prevent race condition
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: storedRefreshToken,
        });

        const { token, refresh_token } = response.data;
        useAuthStore.getState().setTokens(token, refresh_token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        processQueue(null, token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 3. Helper to handle mock vs real api
export const requestApi = async <T>(
  config: AxiosRequestConfig,
  mockData?: T
): Promise<AxiosResponse<T>> => {
  if (USE_MOCK && mockData !== undefined) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[MOCK API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: config as AxiosResponse<T>["config"],
    };
  }

  // Use Real API
  return apiClient.request<T>(config);
};

export default apiClient;
