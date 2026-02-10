import { useImportContext } from "@/context/import-context";
import { Loader2, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";

export const ImportStatusBanner = () => {
  const { importState, clearImport, bannerDismissed, dismissBanner } = useImportContext();

  const isActive = importState.isImporting ||
    (importState.jobStatus && (importState.jobStatus === "pending" || importState.jobStatus === "processing"));
  const isFinished = importState.jobStatus === "completed" || importState.jobStatus === "failed";

  const shouldShow = (isActive && !bannerDismissed) || (isFinished && !bannerDismissed);

  if (!shouldShow) {
    return null;
  }

  const getImportTypeLabel = () => {
    switch (importState.importType) {
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

  // Calculate elapsed time since import started
  const elapsedTime = importState.startedAt
    ? Date.now() - importState.startedAt.getTime()
    : 0;
  const isQuickProcess = elapsedTime < 2000; // Less than 2 seconds
  const shouldShowProgress = !isQuickProcess && importState.progress !== null;

  const getStatusInfo = () => {
    switch (importState.jobStatus) {
      case "pending":
        return {
          icon: Loader2,
          title: "Importación iniciada",
          message: `Preparando importación de ${getImportTypeLabel()}... Puedes seguir navegando por el sistema.`,
          bgColor: "bg-blue-600",
        };
      case "processing":
        return {
          icon: Loader2,
          title: "Importación en proceso",
          message: shouldShowProgress
            ? `Importando ${getImportTypeLabel()}... ${importState.progress || 0}% completado. Puedes seguir navegando por el sistema.`
            : `Importando ${getImportTypeLabel()}... Puedes seguir navegando por el sistema.`,
          bgColor: "bg-blue-600",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          title: "Importación completada",
          message: `La importación de ${getImportTypeLabel()} se ha completado exitosamente.`,
          bgColor: "bg-green-600",
        };
      case "failed":
        return {
          icon: XCircle,
          title: "Importación fallida",
          message: `La importación de ${getImportTypeLabel()} ha fallado. Revisa el dashboard para más detalles.`,
          bgColor: "bg-red-600",
        };
      default:
        return {
          icon: Loader2,
          title: "Importación en proceso",
          message: `Importando ${getImportTypeLabel()}... Puedes seguir navegando por el sistema.`,
          bgColor: "bg-blue-600",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;
  const isProcessing = importState.jobStatus === "pending" || importState.jobStatus === "processing";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10000] ${statusInfo.bgColor} text-white shadow-lg animate-in slide-in-from-top`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Icon className={`h-5 w-5 ${isProcessing ? "animate-spin" : ""}`} />
            <div className="flex-1">
              <p className="font-semibold">{statusInfo.title}</p>
              <p className="text-sm text-white/90">{statusInfo.message}</p>
              {isProcessing && shouldShowProgress && (
                <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${importState.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={isProcessing ? dismissBanner : clearImport}
            className="text-white hover:bg-white/20 hover:text-white"
            title="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

