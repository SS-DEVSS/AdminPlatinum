import axiosClient from "./axiosInstance";

export const cleanFilePath = (
  path: string | null | undefined,
  startIndex: number,
  endIndex?: number
) => {
  if (!path) return "";
  return decodeURIComponent(path.slice(startIndex, endIndex));
};

export interface UploadFileResponse {
  bucket: string;
  key: string;
  location: string;
  status: number;
}

export const uploadFileToS3 = async (
  file: File,
  prefix: string = "uploads/images/"
): Promise<UploadFileResponse> => {
  const client = axiosClient();
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Use backend file upload endpoint instead of direct S3
    const endpoint = prefix.includes("documents") ? "/files/documents" : "/files/images";
    console.log(`[S3FileManager] Uploading file to ${endpoint}, size: ${file.size}, type: ${file.type}`);
    
    const response = await client.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 120 seconds timeout for large files
    });

    console.log(`[S3FileManager] Upload successful: ${response.data.key || response.data.url}`);

    // Backend returns { url, key }, format it to match expected response
    return {
      bucket: "",
      key: response.data.key || "",
      location: response.data.url || "",
      status: response.status,
    };
  } catch (error: any) {
    console.error("[S3FileManager] Error uploading file:", error);
    const errorMessage = error.response?.data?.error || error.message || "Error uploading file";
    throw new Error(errorMessage);
  }
};

export const deleteFileFromS3 = async (path: string) => {
  const client = axiosClient();
  // Extract file ID from path if needed, or use path directly
  // This depends on your backend implementation
  try {
    await client.delete(`/files/images/${path}`);
  } catch (error) {
    // Try documents endpoint if images fails
    await client.delete(`/files/documents/${path}`);
  }
};
