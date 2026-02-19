import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-background">
      <h1 className="text-4xl font-semibold text-muted-foreground">404</h1>
      <p className="text-lg text-muted-foreground text-center">
        Página no encontrada
      </p>
      <Button asChild>
        <Link to="/dashboard/productos" className="gap-2">
          <Home className="h-4 w-4" />
          Ir al inicio
        </Link>
      </Button>
    </div>
  );
}
