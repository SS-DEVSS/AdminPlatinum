import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/models/category";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CardAtributesVariants from "./CardAtributesVariants";

type CategoryCUProps = {
  category?: Category;
};

const CategoryCU = ({ category }: CategoryCUProps) => {
  return (
    <main>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/categorias">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {!category ? "Nueva Categoría" : `${category.name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/categorias">
            <Button variant={"outline"}>Cancelar</Button>
          </Link>
          {!category ? (
            <Button disabled size="sm" className="h-10 px-6 gap-1">
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Agregar Categoría
              </span>
            </Button>
          ) : (
            <Button disabled size="sm" className="h-10 px-6 gap-1">
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Actualizar Categoría
              </span>
            </Button>
          )}
        </div>
      </header>
      <section>
        <section className="mt-4 flex flex-col md:flex-row justify-between gap-3 w-full">
          <Card x-chunk="dashboard-07-chunk-0" className="w-full">
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
              <CardDescription>
                Ingrese la información deseada de la categoría.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    placeholder="Gamer Gear Pro Controller"
                    defaultValue={category ? category.name : ""}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Lorem ipsum dolor sit amet."
                    defaultValue={category ? category.description : ""}
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-0" className="w-full">
            <CardHeader>
              <CardTitle>Imagen de la Categoría</CardTitle>
              <CardDescription>Ingrese la imagen deseada.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input id="name" type="file" className="w-full" />
            </CardContent>
          </Card>
        </section>
        <section className="mt-4 flex flex-col md:flex-row justify-between gap-3 w-full">
          <CardAtributesVariants
            category={category}
            title={"Atributos de Categoría"}
            description={"Ingresa los atributos de la categoría"}
          />
          <CardAtributesVariants
            category={category}
            title={"Atributos de Variantes"}
            description={"Ingresa los atributos de la variante"}
          />
        </section>
      </section>
    </main>
  );
};

export default CategoryCU;
