import { Dispatch, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface MyDropzoneProps {
  file?: File | null;
  fileSetter: Dispatch<React.SetStateAction<File | null>>;
  type?: "document" | "image";
  className?: string;
  currentImageUrl?: string; // URL de la imagen actual (si existe)
  onImageClick?: () => void; // Callback para cuando se hace click en la imagen actual
}

const MyDropzone = ({ file, fileSetter, type, className, currentImageUrl, onImageClick }: MyDropzoneProps) => {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generar y limpiar URL de previsualización cuando cambia el archivo
  useEffect(() => {
    // Verificar que file sea realmente un File object válido
    if (file && file instanceof File && file.name && type === "image") {
      try {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Limpiar URL anterior cuando cambie el archivo o se desmonte
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Error creating object URL:", error);
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [file, type]);

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
            file.name ? file.name.replace(/[()]/g, "") : "file",
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
        : { "image/png": [], "image/jpeg": [], "image/jpg": [], "image/webp": [] },
    maxSize: 5000 * 1000,
  });

  const test = (path: string | undefined): string => {
    if (!path) return "";
    return path.includes("https") ? path.split("/uploads/")[1] : path;
  };

  // Si hay una imagen actual y no se ha seleccionado un nuevo archivo, mostrar layout dividido
  const showSplitLayout = currentImageUrl && !file && !previewUrl && type === "image";
  const showPreview = previewUrl && type === "image";
  const showText = !showSplitLayout && !showPreview;

  // Si hay layout dividido, renderizar estructura diferente
  if (showSplitLayout) {
    return (
      <div className={`${className} flex flex-col gap-4`}>
        {/* Instrucciones arriba */}
        <p className="text-sm text-[#94A3B8] text-center">
          Haz clic en la imagen para previsualizarla o arrastra/haz clic en la zona de la derecha para subir una nueva imagen
        </p>

        {/* Contenedor con imagen a la izquierda y dropzone a la derecha */}
        <div className="flex gap-4">
          {/* Imagen actual a la izquierda */}
          <div className="flex-1 flex justify-center items-center min-h-[300px] border border-gray-200 rounded-lg bg-white p-4">
            <img
              src={currentImageUrl}
              alt="Imagen actual"
              className="max-w-full max-h-full w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                if (onImageClick) {
                  onImageClick();
                }
              }}
            />
          </div>

          {/* Dropzone a la derecha */}
          <div
            {...getRootProps()}
            className={`flex-1 border border-dashed rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center ${isDragActive
                ? "bg-[#F5F9FD] border-[#0bbff4]"
                : "bg-gray-50"
              }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-[#4E5154] text-center">
                Suelta la imagen aquí...
              </p>
            ) : (
              <div className="text-center">
                <p className="text-[#94A3B8] leading-8">
                  Arrastra una imagen aquí o <br />
                  <span className="underline hover:cursor-pointer">
                    haz clic para seleccionar
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    );
  }

  // Layout normal cuando no hay imagen actual
  return (
    <div
      {...getRootProps()}
      className={`${isDragActive
        ? "bg-[#F5F9FD] border-[#0bbff4]"
        : file && file.name
          ? "bg-green-50 border-green-400"
          : ""
        } border border-dashed rounded-lg ${className} flex flex-col items-center justify-center`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p
          className={`${isDragActive ? "text-[#4E5154]" : "text-[#94A3B8]"
            } text-center`}
        >
          Drop the files here ...
        </p>
      ) : (
        <>
          {showPreview && (
            <div className="w-full flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="max-w-full max-h-[300px] object-contain rounded-lg mb-2"
              />
              <p
                className={`text-[#4E5154] text-center overflow-ellipsis text-sm`}
              >
                {file && file.name ? test(file.name) : "Vista previa"}
              </p>
              <p className="text-center text-[#94A3B8] mt-2 text-sm underline hover:cursor-pointer">
                Haz clic para seleccionar otra imagen
              </p>
            </div>
          )}
          {showText && (
            <p
              className={`${isDragActive ? "text-[#4E5154]" : "text-[#94A3B8]"
                } text-center leading-8`}
            >
              Arrastra una imagen aquí o <br />{" "}
              <span className="underline hover:cursor-pointer">
                haz clic para seleccionar
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
