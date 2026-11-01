import axios from "axios";
import { apiClient } from "../lib/apiClient";

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
}

// Cloudinary's per-image limit on the free plan
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const uploadService = {
  /**
   * Uploads an image straight to Cloudinary using a signature from our
   * backend, and returns its URL. Uses plain axios for the Cloudinary call,
   * since apiClient would send our auth token to a third party.
   */
  uploadImage: async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<string> => {
    const { data: sig } =
      await apiClient.post<UploadSignature>("/uploads/signature");

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      form,
      {
        onUploadProgress: (e) => {
          if (onProgress && e.total)
            onProgress(Math.round((e.loaded / e.total) * 100));
        },
      },
    );
    return response.data.secure_url;
  },
};
