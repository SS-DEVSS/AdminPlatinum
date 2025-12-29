import React, { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";

type ImportType = "products" | "references" | "applications";

interface ImportState {
  isImporting: boolean;
  importType: ImportType | null;
  progress: number | null;
  error: string | null;
}

interface ImportContextType {
  importState: ImportState;
  startImport: (file: File, importType: ImportType, categoryId: string) => Promise<void>;
  clearImport: () => void;
}

const ImportContext = createContext<ImportContextType | undefined>(undefined);

export function useImportContext() {
  const context = useContext(ImportContext);
  if (!context) {
    throw new Error("useImportContext must be used within ImportProvider");
  }
  return context;
}

export const ImportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const client = axiosClient();

  const [importState, setImportState] = useState<ImportState>({
    isImporting: false,
    importType: null,
    progress: null,
    error: null,
  });

  const startImport = useCallback(
    async (file: File, importType: ImportType, categoryId: string) => {
      setImportState({
        isImporting: true,
        importType,
        progress: null,
        error: null,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("importType", importType);
        formData.append("categoryId", categoryId);

        await client.post("/import", formData);

        setImportState({
          isImporting: false,
          importType: null,
          progress: null,
          error: null,
        });

        // Show success toast
        toast({
          title: "Importación exitosa",
          description: `Los ${importType === "products" ? "productos" : importType === "references" ? "referencias" : "aplicaciones"} se han importado correctamente.`,
          variant: "success",
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al importar los datos.";

        setImportState({
          isImporting: false,
          importType: null,
          progress: null,
          error: errorMessage,
        });

        // Show error toast
        toast({
          title: "Error al importar",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [client, toast]
  );

  const clearImport = useCallback(() => {
    setImportState({
      isImporting: false,
      importType: null,
      progress: null,
      error: null,
    });
  }, []);

  return (
    <ImportContext.Provider
      value={{
        importState,
        startImport,
        clearImport,
      }}
    >
      {children}
    </ImportContext.Provider>
  );
};

