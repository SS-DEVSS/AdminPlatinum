import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Import,
  PlusCircle,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Category } from "@/models/category";
import { useCategories } from "@/hooks/useCategories";
import DataTable from "@/modules/products/ProductsTable";

const Products = () => {
  const navigate = useNavigate();
  const { categories = [] } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const handleSearchFilter = (e: any) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  return (
    <Layout>
      <div>
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-end p-0 m-0">
            <div className="flex flex-col gap-3">
              <CardTitle>Productos</CardTitle>
              <div className="flex gap-3">
                <div className="relative ml-0 flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar Producto..."
                    value={searchFilter}
                    onChange={handleSearchFilter}
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
                <Select
                  value={category?.id}
                  onValueChange={(value: string) => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id === value
                    );
                    setCategory(selectedCategory || null);
                  }}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id || ""}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="rounded-lg flex bg-[#F4F4F5]">
                <div
                  onClick={() => navigate("/producto/importar")}
                  className="flex hover:cursor-pointer gap-3 items-center hover:bg-primary hover:text-white hover:[&>svg]:text-white rounded-lg m-1 px-3"
                >
                  <Import />
                  <Button
                    className="hover:bg-transparent hover:text-white"
                    variant={"ghost"}
                  >
                    Importar
                  </Button>
                </div>
              </div>
              <Link to="/producto/new-product">
                <Button size="sm" className="h-10 px-6 gap-1">
                  <PlusCircle className="h-3.5 w-3.5 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Producto
                  </span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <div>
            <DataTable category={category} searchFilter={searchFilter} />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
