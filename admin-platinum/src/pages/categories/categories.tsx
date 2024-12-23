import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import CardSectionLayout from "@/components/Layouts/CardSectionLayout";
import CardTemplate from "@/components/Layouts/CardTemplate";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Category } from "@/models/category";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { Brand } from "@/models/brand";

const Categorias = () => {
  const { categories, getCategories } = useCategories();
  const { brands } = useBrands();

  return (
    <Layout>
      <div>
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row p-0 m-0">
            <div className="flex flex-col gap-3">
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Maneja tus categorías.</CardDescription>
            </div>
            <div className="ml-auto flex gap-3">
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar Categoría..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Link to="/categorias/nueva">
                <Button size="sm" className="h-10 px-6 gap-1">
                  <PlusCircle className="h-3.5 w-3.5 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Categoría
                  </span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardSectionLayout>
            {categories.length === 0 ? (
              <></>
            ) : (
              <>
                {categories.map((categoria: Category) => (
                  <CardTemplate
                    category={categoria}
                    key={categoria.id}
                    brands={categoria.brands}
                    getItems={getCategories}
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

export default Categorias;
