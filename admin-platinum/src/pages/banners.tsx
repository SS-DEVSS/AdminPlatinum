import Layout from "@/components/Layouts/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Banners = () => {
  return (
    <Layout>
      <section className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Banners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Agregar nuevo banner</CardTitle>
            <CardDescription>Ingrese el nuevo banner deseado.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Banners existentes</CardTitle>
            <CardDescription>
              Revisa, elimina y cambia el orden de los banners de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="flex">
              <CardHeader>
                <div className="">
                  <img src="" alt="" className="" />
                </div>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Banners;
