import { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface MyDropzoneProps {
  file: { name: string };
  fileSetter: Dispatch<React.SetStateAction<{ name: string }>>;
}

const MyDropzone = ({ file, fileSetter }: MyDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    const sanitizedFiles = acceptedFiles.map((file: File) => {
      const sanitizedFile = new File([file], file.name.replace(/[()]/g, ""), {
        type: file.type,
      });
      return sanitizedFile;
    });
    fileSetter(sanitizedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`${
        isDragActive
          ? "bg-[#F5F9FD] border-[#0bbff4]"
          : file.name
          ? "bg-green-50 border-green-400"
          : ""
      } p-16 border border-dashed rounded-lg`}
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
                } text-center`}
              >
                {file.name}
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
    </div>
  );
};

export default MyDropzone;
