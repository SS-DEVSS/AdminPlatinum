import S3 from "react-aws-s3-typescript";

const ReactS3Client = new S3({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  bucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
  region: import.meta.env.VITE_AWS_REGION,
});

export const cleanFilePath = (
  path: string,
  startIndex: number,
  endIndex?: number
) => decodeURIComponent(path.slice(startIndex, endIndex));

export const uploadFileToS3 = async (
  file: File,
  prefix: string = "uploads/images/"
) => {
  const cleanedFileName = file.name
    .replace(/\s+/g, "")
    .replace(/\.[^/.]+$/, "")
    .replace(/[()]/g, "");
  const filePath = `${prefix}${cleanedFileName}`;

  return ReactS3Client.uploadFile(file, filePath);
};

export const deleteFileFromS3 = async (path: string) => {
  return ReactS3Client.deleteFile(path);
};
