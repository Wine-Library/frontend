import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const token = {
  set(token: string) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  unset() {
    instance.defaults.headers.common["Authorization"] = "";
  },
};