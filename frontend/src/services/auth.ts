import apiClient from "@/lib/api";
import type { CreateUser, LoginUser, TokenResponse, User } from "@/types";

const AUTH_BASE = "/api/v1/auth";

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: CreateUser): Promise<User> => {
    const response = await apiClient.post<User>(`${AUTH_BASE}/register`, data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginUser): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(`${AUTH_BASE}/login`, data);
    return response.data;
  },

  /**
   * Login with OAuth2 form (for compatibility)
   */
  loginForm: async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await apiClient.post<TokenResponse>(`${AUTH_BASE}/login/form`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(`${AUTH_BASE}/refresh`, {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>(`${AUTH_BASE}/me`);
    return response.data;
  },

  /**
   * Logout (clear tokens locally)
   */
  logout: (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("hyrex_user");
  },
};

export default authApi;
