import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useBrands } from "@/hooks/useBrands";
import { Category, CategoryAtributes } from "@/models/category";
import {
  ChevronLeft,
  PlusCircle,
  PlusCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CardAtributesVariants from "./CardAtributesVariants";

type CategoryCUProps = {
  category?: Category;
};

interface formTypes {
  name: string;
  description: string;
  imgUrl: string;
  brands: string[];
  attributes: CategoryAtributes[];
}

const CategoryCU = ({ category }: CategoryCUProps) => {
  const { brands } = useBrands();

  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(
    new Set()
  );
  const [form, setForm] = useState<formTypes>({
    name: "",
    description: "",
    imgUrl: "",
    brands: [],
    attributes: [],
  });

  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleBrandSelection = (brandId: string) => {
    setSelectedBrandIds((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(brandId)) {
        updatedSet.delete(brandId);
      } else {
        updatedSet.add(brandId);
      }
      return updatedSet;
    });
  };

  console.log(selectedBrandIds);

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
          <Card x-chunk="dashboard-07-chunk-0" className="w-1/2">
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
                    name="name"
                    type="text"
                    className="w-full"
                    placeholder="Gamer Gear Pro Controller"
                    onChange={handleFormInput}
                    value={category ? category.name : form.name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Lorem ipsum dolor sit amet."
                    onChange={handleFormInput}
                    value={category ? category.description : form.description}
                    className="min-h-20"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="image">Imagen de la Categoría</Label>
                  <Input
                    id="imgUrl"
                    name="imgUrl"
                    type="text"
                    placeholder="https://"
                    className="w-full"
                    onChange={handleFormInput}
                    value={category ? category.imgUrl : form.imgUrl}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <section className="w-1/2 flex flex-col justify-between gap-4">
            <Card x-chunk="dashboard-07-chunk-0" className="flex-grow">
              <CardHeader>
                <CardTitle>Asociar a Marcas</CardTitle>
                <CardDescription>
                  Selecciones una marca si desea asociarla a la categoría.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Marcas Asociadas:</CardTitle>
                <section className="flex mt-4 gap-3">
                  {[...selectedBrandIds].map((id) => {
                    const brand = brands.find((brand) => brand.id === id);
                    return brand ? (
                      <Badge
                        className="text-base px-5 py-2 flex gap-3"
                        key={brand.id}
                      >
                        {brand.name}
                        <XCircleIcon
                          onClick={() => toggleBrandSelection(brand.id!)}
                          className="hover:cursor-pointer"
                        />
                      </Badge>
                    ) : null;
                  })}
                </section>
              </CardContent>
              <Separator />
              <CardContent>
                <CardTitle className="text-base my-5">
                  Marcas por explorar:
                </CardTitle>
                <section className="flex gap-3 flex-wrap">
                  {brands.map((brand) => {
                    const isSelected = selectedBrandIds.has(brand.id!);
                    return (
                      <Badge
                        key={brand.id}
                        variant={`${isSelected ? "default" : "secondary"}`}
                        className="text-base px-5 py-2 flex gap-3"
                      >
                        {brand.name}
                        {!isSelected ? (
                          <PlusCircleIcon
                            onClick={() => toggleBrandSelection(brand.id!)}
                            className="hover:cursor-pointer"
                          />
                        ) : (
                          <XCircleIcon
                            onClick={() => toggleBrandSelection(brand.id!)}
                            className="hover:cursor-pointer"
                          />
                        )}
                      </Badge>
                    );
                  })}
                </section>
              </CardContent>
            </Card>
          </section>
        </section>
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
    </main>
  );
};

export default CategoryCU;
