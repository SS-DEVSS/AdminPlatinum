import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";
import { ImportJobStatus } from "@/models/importJob";

type ImportType = "products" | "references" | "applications";

interface ImportState {
  isImporting: boolean;
  importType: ImportType | null;
  progress: number | null;
  error: string | null;
  jobId: string | null;
  jobStatus: ImportJobStatus | null;
  startedAt: Date | null;
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

export const ImportProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { toast } = useToast();
  const client = axiosClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const [importState, setImportState] = useState<ImportState>({
    isImporting: false,
    importType: null,
    progress: null,
    error: null,
    jobId: null,
    jobStatus: null,
    startedAt: null,
  });

  const getImportTypeLabel = (type: ImportType) => {
    switch (type) {
      case "products":
        return "productos";
      case "references":
        return "referencias";
      case "applications":
        return "aplicaciones";
      default:
        return "datos";
    }
  };

  const checkJobStatus = useCallback(
    async (jobId: string, importType: ImportType) => {
      try {
        const response = await client.get(`/jobs/${jobId}`);
        const job = response.data;

        setImportState((prev) => ({
          ...prev,
          progress: job.progress || 0,
          jobStatus: job.status,
        }));

        // If job is completed or failed, stop polling and show final message
        if (job.status === "completed" || job.status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          const elapsedTime = startTimeRef.current
            ? Date.now() - startTimeRef.current.getTime()
            : 0;
          const isQuickProcess = elapsedTime < 3000; // Less than 3 seconds

          // Always show final toast with results
          if (job.status === "completed") {
            const created = job.created || 0;
            const updated = job.updated || 0;
            const failed = job.failed || 0;
            
            let description = `Los ${getImportTypeLabel(importType)} se han importado correctamente.`;
            if (created > 0 || updated > 0) {
              description += ` ${created} creado(s), ${updated} actualizado(s).`;
            }
            if (failed > 0) {
              description += ` ${failed} fallido(s).`;
            }

            toast({
              title: "Importación completada",
              description,
              variant: "default",
            });
          } else {
            const errorCount = job.errors?.length || 0;
            const errorMessage = job.errors?.[0] || "Error desconocido";
            
            toast({
              title: "Importación fallida",
              description: errorCount > 0 
                ? `${errorCount} error(es) encontrado(s). ${errorMessage}`
                : "La importación falló. Por favor, revisa el dashboard para más detalles.",
              variant: "destructive",
            });
          }

          // Clear import state after a delay to allow user to see the final state
          // Longer delay for longer processes
          const delay = isQuickProcess ? 3000 : Math.min(10000, Math.max(5000, elapsedTime / 2));
          
          setTimeout(() => {
            setImportState({
              isImporting: false,
              importType: null,
              progress: null,
              error: null,
              jobId: null,
              jobStatus: null,
              startedAt: null,
            });
            startTimeRef.current = null;
          }, delay);
        }
      } catch (error: any) {
        console.error("Error checking job status:", error);
        // Don't stop polling on error, just log it
      }
    },
    [client, toast]
  );

  const startImport = useCallback(
    async (file: File, importType: ImportType, categoryId: string) => {
      // Clear any existing polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      const startTime = new Date();
      startTimeRef.current = startTime;

      setImportState({
        isImporting: true,
        importType,
        progress: 0,
        error: null,
        jobId: null,
        jobStatus: "pending",
        startedAt: startTime,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("importType", importType);
        formData.append("categoryId", categoryId);

        const response = await client.post("/import", formData);
        const { jobId, status } = response.data;

        setImportState((prev) => ({
          ...prev,
          jobId,
          jobStatus: status || "pending",
        }));

        // Start polling job status every 2 seconds
        pollingIntervalRef.current = setInterval(() => {
          if (jobId) {
            checkJobStatus(jobId, importType);
          }
        }, 2000);

        // Check immediately to see if job is already done (fast process)
        checkJobStatus(jobId, importType);
        
        // Only show initial toast if job is still processing (not a fast process)
        // We'll check again after a short delay to see if it's still processing
        setTimeout(async () => {
          try {
            const statusResponse = await client.get(`/jobs/${jobId}`);
            const currentJob = statusResponse.data;
            
            // If still processing after 1 second, show the initial toast
            if (currentJob.status === "pending" || currentJob.status === "processing") {
              toast({
                title: "Importación iniciada",
                description: `La importación de ${getImportTypeLabel(importType)} ha comenzado. Puedes seguir navegando mientras se procesa.`,
                variant: "default",
              });
            }
          } catch (error) {
            // Ignore errors in this check
          }
        }, 1000);
      } catch (error: any) {
        // Clear polling on error
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al iniciar la importación.";

        setImportState({
          isImporting: false,
          importType: null,
          progress: null,
          error: errorMessage,
          jobId: null,
          jobStatus: null,
          startedAt: null,
        });
        startTimeRef.current = null;

        // Show error toast
        toast({
          title: "Error al importar",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [client, toast, checkJobStatus]
  );

  const clearImport = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setImportState({
      isImporting: false,
      importType: null,
      progress: null,
      error: null,
      jobId: null,
      jobStatus: null,
      startedAt: null,
    });
    startTimeRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
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

