import { useImportContext } from "@/context/import-context";
import { Loader2, X } from "lucide-react";
import { Button } from "./ui/button";

export const ImportStatusBanner = () => {
  const { importState, clearImport } = useImportContext();

  if (!importState.isImporting) {
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

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-blue-600 text-white shadow-lg animate-in slide-in-from-top">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <div>
              <p className="font-semibold">Importación en proceso</p>
              <p className="text-sm text-blue-100">
                Importando {getImportTypeLabel()}... Puedes seguir navegando por el sistema.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearImport}
            className="text-white hover:bg-blue-700 hover:text-white"
            disabled
            title="La importación está en proceso"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

