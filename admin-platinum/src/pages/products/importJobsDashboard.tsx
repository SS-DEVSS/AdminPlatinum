import { Link } from "react-router-dom";
import Layout from "@/components/Layouts/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload } from "lucide-react";
import ImportJobsDashboard from "@/components/importJobs/ImportJobsDashboard";

const ImportJobsDashboardPage = () => {
  return (
    <Layout>
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/productos">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            Dashboard de Importaciones
          </p>
        </div>
        <Link to="/producto/importar">
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Nueva Importación
          </Button>
        </Link>
      </header>

      <section className="flex flex-col justify-center gap-4 mt-8">
        <ImportJobsDashboard />
      </section>
    </Layout>
  );
};

export default ImportJobsDashboardPage;

