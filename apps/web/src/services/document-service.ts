import { apiClient } from "./api-client";


export interface ProcessedDocument {
  id: number;
  path: string;
  type: string;
  processing_date: string | null;
  process_by: string | null;

  bp_measure: string | null;
  bp_measure_date: string | null;

  a1c_measure: string | null;
  a1c_measure_date: string | null;

  status: 'Processing' | 'Success' | 'Needs Review' | 'Failed';
}

interface ProcessedDocumentsResponse {
  data: ProcessedDocument[];
}

export const fileService = {
  getProcessedDocuments: async (): Promise<ProcessedDocument[]> => {
    const response =
      await apiClient.get<ProcessedDocumentsResponse>(
        'v1/api/files',
      );

    return response.data;
  },

  retryDocument: async (fileId: number) => {
    return apiClient.get(
      `v1/api/files/${fileId}`,
    );
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    return apiClient.post(
      'v1/api/files',
      formData,
    );
  },
};