import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {};

const Marcas = (props: Props) => {
  return (
    <Layout>
      <div>
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row p-0 m-0">
            <div className="flex flex-col gap-3">
              <CardTitle>Marcas</CardTitle>
              <CardDescription>
                Maneja tus marcas y las categorias asociadas a cada una de ellas
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-10 px-6 gap-1">
                    <PlusCircle className="h-3.5 w-3.5 mr-2" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Marca
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="mb-2">Agregar Marca</DialogTitle>
                    <DialogDescription>
                      Agregar una nueva marca al sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <Label htmlFor="name">
                    <span className="text-redLabel">*</span>Nombre
                  </Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="ej. Platinum"
                    required
                  />
                  <Label htmlFor="email">Imagen</Label>
                  <Input
                    id="name"
                    type="file"
                    placeholder="ej. Platinum"
                    required
                  />
                  <DialogDescription>
                    Formatos Válidos: jpg, png, jpeg
                  </DialogDescription>
                  <DialogFooter>
                    <Button disabled type="submit">
                      Agregar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* {categories.map((category) => (
                <Link href={`/admin/Categories/category/${category.title}`}>
                  <Card key={category.id} className="w-full">
                    <Image
                      width={600}
                      height={100}
                      src={`${category.image}`}
                      alt="name"
                      className="max-h-[300px] object-cover rounded-t-lg"
                    />
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <CardTitle className="mt-6 mb-4">
                          {category.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="leading-7">
                        {category.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))} */}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Marcas;
