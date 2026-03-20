import { apiClient } from "@/lib/api";

export interface TTSGenerateRequest {
  text: string;
  emotion: string;
  speed?: number;
  cfg_strength?: number;
  nfe_step?: number;
}

export interface TTSGeneration {
  id: string;
  text: string;
  emotion: string;
  file_name: string;
  file_size: number | null;
  content_type: string;
  created_at: string;
}

export interface TTSGenerationListItem {
  id: string;
  text: string;
  emotion: string;
  file_name: string;
  created_at: string;
}

const BASE = "/api/v1/tts";

export const ttsApi = {
  generate: async (data: TTSGenerateRequest): Promise<TTSGeneration> => {
    const response = await apiClient.post(`${BASE}/generate`, data);
    return response.data;
  },

  listGenerations: async (
    skip = 0,
    limit = 20
  ): Promise<TTSGenerationListItem[]> => {
    const response = await apiClient.get(`${BASE}/generations`, {
      params: { skip, limit },
    });
    return response.data;
  },

  getDownloadUrl: (generationId: string): string => {
    const baseURL = apiClient.defaults.baseURL || "";
    return `${baseURL}${BASE}/generations/${generationId}/download`;
  },
};
