import { Loader2 } from "lucide-react";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader = ({ message = "Cargando...", fullScreen = false }: LoaderProps) => {
  const containerClass = fullScreen
    ? "fixed inset-0 z-[10000] bg-background/80 backdrop-blur-sm flex items-center justify-center [&_*]:pointer-events-none"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass} style={{ pointerEvents: 'none' }}>
      <div className="flex flex-col items-center gap-4 pointer-events-auto">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default Loader;

