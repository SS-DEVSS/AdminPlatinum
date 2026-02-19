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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Category } from "@/models/category";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import type { SubcategoryTreeNode } from "@/models/subcategory";
import DataTable from "@/modules/products/ProductsTable";

function flattenSubcategoryTree(nodes: SubcategoryTreeNode[], path: string[] = []): { id: string; name: string; label: string }[] {
  const result: { id: string; name: string; label: string }[] = [];
  for (const node of nodes) {
    const currentPath = [...path, node.name];
    result.push({ id: node.id, name: node.name, label: currentPath.join(" › ") });
    if (node.children?.length) result.push(...flattenSubcategoryTree(node.children, currentPath));
  }
  return result;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories = [] } = useCategories();
  const { getTree } = useSubcategories();
  const [searchFilter, setSearchFilter] = useState(() => {
    const saved = localStorage.getItem('products-search-filter');
    return saved || "";
  });
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ id: string; name: string; label: string }[]>([]);

  const handleSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchFilter(value);
    if (value) {
      localStorage.setItem('products-search-filter', value);
    } else {
      localStorage.removeItem('products-search-filter');
    }
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value) || null;
    setCategory(selectedCategory);
    setSubcategoryId(null);
    if (selectedCategory?.id) {
      localStorage.setItem('products-selected-category', selectedCategory.id);
    } else {
      localStorage.removeItem('products-selected-category');
    }
  };

  useEffect(() => {
    if (!category?.id) {
      setSubcategoryOptions([]);
      return;
    }
    getTree(category.id).then((tree) => setSubcategoryOptions(flattenSubcategoryTree(tree)));
  }, [category?.id, getTree]);

  useEffect(() => {
    if (categories.length === 0) return;
    const fromUrl = searchParams.get('categoryId');
    const subFromUrl = searchParams.get('subcategoryId');
    if (fromUrl) {
      const cat = categories.find((c) => c.id === fromUrl);
      if (cat) {
        setCategory(cat);
        setSubcategoryId(subFromUrl || null);
      }
      return;
    }
    const savedCategoryId = localStorage.getItem('products-selected-category');
    const savedCategory = savedCategoryId ? categories.find((cat) => cat.id === savedCategoryId) : null;
    if (savedCategory) {
      setCategory(savedCategory);
    } else {
      setCategory(categories[0]);
      localStorage.setItem('products-selected-category', categories[0].id || '');
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
                  value={category?.id ?? ""}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id || ""}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {category?.id && subcategoryOptions.length > 0 && (
                  <Select
                    value={subcategoryId ?? "__all__"}
                    onValueChange={(v) => setSubcategoryId(v === "__all__" ? null : v)}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Todas las subcategorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subcategoría</SelectLabel>
                        <SelectItem value="__all__">Todas</SelectItem>
                        {subcategoryOptions.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
            <DataTable category={category} searchFilter={searchFilter} subcategoryId={subcategoryId} />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
