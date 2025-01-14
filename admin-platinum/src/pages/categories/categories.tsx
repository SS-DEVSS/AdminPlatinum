import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
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
import { useState } from "react";
import { useMemo } from "react";
import NoData from "@/components/NoData";

const Categorias = () => {
  const { categories, getCategories, deleteCategory, getCategoryById } =
    useCategories();
  const { brands } = useBrands();

  const [searchFilter, setSearchFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState<Brand["id"]>("");

  const handleSearchFilter = (e: any) => {
    const { value } = e.target;
    setSearchFilter(value);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category: Category) => {
      const matchesSearch =
        !searchFilter ||
        category.name.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesBrand =
        !brandFilter ||
        brandFilter === "-" ||
        category.brands?.some((brand: any) => brand.id === brandFilter);

      return matchesSearch && matchesBrand;
    });
  }, [searchFilter, brandFilter, categories]);

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
                  value={searchFilter}
                  onChange={handleSearchFilter}
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    <SelectItem value={"-"}>Seleccionar</SelectItem>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id!}>
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
          {categories.length === 0 && filteredCategories.length === 0 ? (
            <div className="mt-4">
              <NoData>
                <AlertTriangle className="text-[#4E5154]" />
                <p className="text-[#4E5154]">
                  No se ha creado ninguna categoría
                </p>
                <p className="text-[#94A3B8] font-semibold text-sm">
                  Agrega uno en la parte posterior
                </p>
              </NoData>
            </div>
          ) : (
            <CardSectionLayout>
              {(filteredCategories.length > 0
                ? filteredCategories
                : categories
              ).map((categoria: Category) => (
                <CardTemplate
                  category={categoria}
                  key={categoria.id}
                  getItems={getCategories}
                  deleteCategory={deleteCategory}
                  getCategoryById={getCategoryById}
                />
              ))}
            </CardSectionLayout>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Categorias;
