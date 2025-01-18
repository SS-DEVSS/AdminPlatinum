import { useState } from "react";
import { deleteFileFromS3, uploadFileToS3 } from "@/services/S3FileManager";

export const useS3FileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, onSuccess: (key: string) => void) => {
    setUploading(true);
    setError(null);
    try {
      const data = await uploadFileToS3(file);
      onSuccess(data.key);
    } catch (e: any) {
      setError(e.message || "Error uploading file");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string, onSuccess: () => void) => {
    try {
      await deleteFileFromS3(path);
      onSuccess();
    } catch (e: any) {
      setError(e.message || "Error deleting file");
      console.error(e);
    }
  };

  return { uploading, error, uploadFile, deleteFile };
};
