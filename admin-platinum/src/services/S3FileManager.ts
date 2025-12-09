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
    const response = await client.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Backend returns { url, key }, format it to match expected response
    return {
      bucket: "",
      key: response.data.key || "",
      location: response.data.url || "",
      status: response.status,
    };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(error.response?.data?.error || "Error uploading file");
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
