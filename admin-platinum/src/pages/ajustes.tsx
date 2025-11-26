import Layout from "@/components/Layouts/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Ajustes = () => {
  return (
    <Layout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
          <CardDescription>
            Configuración general de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Ajustes;

