import { useState } from "react";
import { deleteFileFromS3, uploadFileToS3 } from "@/services/S3FileManager";
import { toast } from "./use-toast";

export const useS3FileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    onSuccess: (key: string, location: string) => void
  ) => {
    if (!file || !file.type) return null;
    setUploading(true);
    setError(null);
    const fileNameLen = file.name.length + 66;
    if (fileNameLen > 255) {
      toast({
        title: "El nombre de la imagen tiene que ser menor a 255 characteres.",
        variant: "destructive",
      });
      throw new Error(
        "El nombre de la imagen tiene que ser menor a 255 characteres"
      );
    }
    try {
      const extension = file.type.split("/")[1];
      let data: any;
      if (extension === "pdf") {
        data = await uploadFileToS3(file, "uploads/documents/");
      } else {
        data = await uploadFileToS3(file);
      }
      console.log(data);
      if (data && data.key && data.location) {
        onSuccess(data.key, data.location);
      } else {
        throw new Error("Upload failed: invalid response");
      }
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
