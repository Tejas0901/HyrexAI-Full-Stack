import apiClient from "@/lib/api";
import type { User, UserUpdate, PaginationParams } from "@/types";

const USERS_BASE = "/api/v1/users";

export const usersApi = {
  /**
   * List all users with pagination
   */
  list: async (params?: PaginationParams): Promise<User[]> => {
    const response = await apiClient.get<User[]>(USERS_BASE, {
      params: {
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 20,
      },
    });
    return response.data;
  },

  /**
   * Get a specific user by ID
   */
  get: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`${USERS_BASE}/${userId}`);
    return response.data;
  },

  /**
   * Update a user
   */
  update: async (userId: string, data: UserUpdate): Promise<User> => {
    const response = await apiClient.put<User>(`${USERS_BASE}/${userId}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  delete: async (userId: string): Promise<void> => {
    await apiClient.delete(`${USERS_BASE}/${userId}`);
  },
};

export default usersApi;
