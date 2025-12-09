import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { supabase } from "./supabase";

const axiosClient = (token: string | null = null): AxiosInstance => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    : {
        "Content-Type": "multipart/form-data",
      };

  const client = axios.create({
    baseURL: "http://localhost:4000/api/v1",
    headers,
    timeout: 60000,
    withCredentials: false,
  });

  client.interceptors.request.use(async (config: any) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    config.headers = config.headers || {};
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      try {
        const { response } = error;
        if (response?.status === 401) {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }
      } catch (e) {
        console.error(e);
      }
      throw error;
    }
  );

  return client;
};

export default axiosClient;
