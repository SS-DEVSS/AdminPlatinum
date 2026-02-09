import { Link } from "react-router-dom";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ImportJobsDashboard from "@/components/importJobs/ImportJobsDashboard";

const ImportJobsDashboardPage = () => {
  return (
    <Layout>
      <ImportJobsDashboard
        headerActions={
          <Link to="/dashboard/producto/importar">
            <Button size="sm" className="h-10 px-6 gap-1">
              <Upload className="h-3.5 w-3.5 mr-2" />
              Nueva Importación
            </Button>
          </Link>
        }
      />
    </Layout>
  );
};

export default ImportJobsDashboardPage;

