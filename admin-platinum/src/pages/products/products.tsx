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
  // Cargar searchFilter desde localStorage al inicializar
  const [searchFilter, setSearchFilter] = useState(() => {
    const saved = localStorage.getItem('products-search-filter');
    return saved || "";
  });
  // Cargar categoría desde localStorage al inicializar
  const [category, setCategory] = useState<Category | null>(() => {
    // const savedCategoryId = localStorage.getItem('products-selected-category');
    return null; // Se inicializará en el useEffect cuando tengamos las categorías
  });

  const handleSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchFilter(value);
    // Guardar en localStorage
    if (value) {
      localStorage.setItem('products-search-filter', value);
    } else {
      localStorage.removeItem('products-search-filter');
    }
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === value
    );
    const categoryToSet = selectedCategory || null;
    setCategory(categoryToSet);
    // Guardar en localStorage
    if (categoryToSet?.id) {
      localStorage.setItem('products-selected-category', categoryToSet.id);
    } else {
      localStorage.removeItem('products-selected-category');
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      // Intentar restaurar categoría guardada
      const savedCategoryId = localStorage.getItem('products-selected-category');
      if (savedCategoryId && !category) {
        const savedCategory = categories.find((cat) => cat.id === savedCategoryId);
        if (savedCategory) {
          setCategory(savedCategory);
          return;
        }
      }
      // Si no hay categoría guardada o no se encontró, usar la primera
      if (!category) {
        setCategory(categories[0]);
        localStorage.setItem('products-selected-category', categories[0].id || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <Layout>
      <div className="w-full max-w-full">
        <Card className="border-0 shadow-none w-full">
          <CardHeader className="flex flex-row items-end p-0 m-0 pb-6 w-full">
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
                  onValueChange={handleCategoryChange}
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
                  onClick={() => navigate("/dashboard/importaciones")}
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
              <Link to="/dashboard/producto/new-product">
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
