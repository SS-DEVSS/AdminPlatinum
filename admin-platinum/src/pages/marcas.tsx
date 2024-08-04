import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import CardSectionLayout from "@/components/Layouts/CardSectionLayout";
import CardTemplate from "@/components/Layouts/CardTemplate";

type Props = {};

const brands = [
  {
    id: 1,
    image:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: 2,
    image: "",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: 3,
    image: "",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: 1,
    image:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: 2,
    image: "",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
  {
    id: 3,
    image: "",
    title: "Platinum Driveline",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
  },
];

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
            <div className="ml-auto flex gap-3">
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar Marca..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
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
                      Agregar Marca
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardSectionLayout>
            {brands.length === 0 ? (
              <></>
            ) : (
              <>
                {brands.map((brand) => (
                  <CardTemplate
                    key={brand.id}
                    image={brand.image}
                    title={brand.title}
                    description={brand.description}
                  />
                ))}
              </>
            )}
          </CardSectionLayout>
        </Card>
      </div>
    </Layout>
  );
};

export default Marcas;
