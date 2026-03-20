import { apiClient } from "@/lib/api";

export interface VoiceCloneSynthesis {
  id: string;
  clone_name: string;
  language: string;
  target_text: string;
  file_name: string;
  file_size: number | null;
  content_type: string;
  status: string;
  created_at: string;
}

export interface VoiceCloneSynthesisListItem {
  id: string;
  clone_name: string;
  language: string;
  target_text: string;
  file_name: string;
  status: string;
  created_at: string;
}

const BASE = "/api/v1/voice-clone";

export const voiceCloneApi = {
  synthesize: async (data: {
    referenceAudio: File;
    targetText: string;
    cloneName: string;
    language: string;
  }): Promise<VoiceCloneSynthesis> => {
    const formData = new FormData();
    formData.append("reference_audio", data.referenceAudio);
    formData.append("target_text", data.targetText);
    formData.append("clone_name", data.cloneName);
    formData.append("language", data.language);

    const response = await apiClient.post(`${BASE}/synthesize`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120_000,
    });
    return response.data;
  },

  listSyntheses: async (
    skip = 0,
    limit = 20
  ): Promise<VoiceCloneSynthesisListItem[]> => {
    const response = await apiClient.get(`${BASE}/syntheses`, {
      params: { skip, limit },
    });
    return response.data;
  },

  getDownloadUrl: (synthesisId: string): string => {
    const baseURL = apiClient.defaults.baseURL || "";
    return `${baseURL}${BASE}/syntheses/${synthesisId}/download`;
  },
};
