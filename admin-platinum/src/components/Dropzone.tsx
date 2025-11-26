import { cleanFilePath } from "@/services/S3FileManager";
import { type } from "os";
import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface MyDropzoneProps {
  file: File;
  fileSetter: Dispatch<React.SetStateAction<File>>;
  type?: "document" | "image";
  className?: string;
}

const MyDropzone = ({ file, fileSetter, type, className }: MyDropzoneProps) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        setError("Selecciona un archivo válido.");
        return;
      }

      if (acceptedFiles.length > 0) {
        const sanitizedFiles = acceptedFiles.map((file) => {
          const sanitizedFile = new File(
            [file],
            file.name.replace(/[()]/g, ""),
            {
              type: file.type,
            }
          );
          return sanitizedFile;
        });
        fileSetter(sanitizedFiles[0]);
      }
    },
    [fileSetter]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      type === "document"
        ? { "application/pdf": [] }
        : { "image/png": [], "image/jpeg": [], "image/jpg": [] },
    maxSize: 5000 * 1000,
  });

  const test = (path: string): string => {
    return path.includes("https") ? path.split("/uploads/")[1] : path;
  };

  return (
    <div
      {...getRootProps()}
      className={`${
        isDragActive
          ? "bg-[#F5F9FD] border-[#0bbff4]"
          : file.name
          ? "bg-green-50 border-green-400"
          : ""
      } border border-dashed rounded-lg ${className}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p
          className={`${
            isDragActive ? "text-[#4E5154]" : "text-[#94A3B8]"
          } text-center`}
        >
          Drop the files here ...
        </p>
      ) : (
        <>
          {file.name ? (
            <>
              <p
                className={`${
                  isDragActive ? "text-[#4E5154]" : "text-[#94A3B8]"
                } text-center overflow-ellipsis`}
              >
                {test(file.name)}
              </p>
              <p className="text-center text-[#94A3B8] mt-4 underline hover:cursor-pointer">
                Click to select another file
              </p>
            </>
          ) : (
            <p
              className={`${
                isDragActive ? "text-[#4E5154]" : "text-[#94A3B8]"
              } text-center leading-8`}
            >
              Drag 'n' drop some files here, <br />{" "}
              <span className="underline hover:cursor-pointer">
                Click to select files
              </span>
            </p>
          )}
        </>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default MyDropzone;
