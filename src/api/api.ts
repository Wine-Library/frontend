import axios from "axios";
import { refreshTokenApi } from "./auth";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const tokenManager = {
  set(accessToken: string) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  },
  unset() {
    delete instance.defaults.headers.common["Authorization"];
  },
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },
  setRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  },
  clearRefreshToken() {
    localStorage.removeItem("refreshToken");
  },
};

let isRefreshing = false;
let pendingQueue: Array<(newAccessToken: string) => void> = [];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      const savedRefreshToken = tokenManager.getRefreshToken();

      if (!savedRefreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { token: newAccessToken, refreshToken: newRefreshToken } = await refreshTokenApi(savedRefreshToken);
        tokenManager.set(newAccessToken);
        tokenManager.setRefreshToken(newRefreshToken);

        pendingQueue.forEach((cb) => cb(newAccessToken));
        pendingQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        tokenManager.unset();
        tokenManager.clearRefreshToken();
        pendingQueue = [];
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);