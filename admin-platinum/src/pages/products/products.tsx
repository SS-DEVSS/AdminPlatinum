import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Download,
  File,
  Import,
  PlusCircle,
  Search,
  Share,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Category } from "@/models/category";
import { useCategories } from "@/hooks/useCategories";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/modules/products/ProductsTable";

const Products = () => {
  const navigate = useNavigate();
  const { categories = [] } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [modalOpenExport, setModalOpenExport] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const handleSearchFilter = (e: any) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleCheckAll = (isChecked: boolean) => {
    setCheckedAll(isChecked);
    if (isChecked) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  };

  return (
    <Layout>
      <Dialog
        open={modalOpenExport}
        onOpenChange={(open: boolean) => !open && setModalOpenExport(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Exportar Productos</DialogTitle>
            <DialogDescription>
              Selecciona las categorías que deseas exportar.
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={checkedAll}
                    onCheckedChange={(prev: boolean) => handleCheckAll(prev)}
                    className="border-[#d0d2d6] mt-1"
                  />
                </TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Número de Productos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Checkbox
                      checked={
                        checkedAll || selectedCategories.includes(category)
                      }
                      onCheckedChange={() => {
                        const updatedSelection = selectedCategories.includes(
                          category
                        )
                          ? selectedCategories.filter(
                            (c) => c.id !== category.id
                          )
                          : [...selectedCategories, category];
                        setSelectedCategories(updatedSelection);
                        if (updatedSelection.length === categories.length) {
                          setCheckedAll(true);
                        } else {
                          setCheckedAll(false);
                        }
                      }}
                      className="border-[#d0d2d6] mt-1"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="text-[#71717A] font-medium">
                      {category.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[#71717A] font-medium">
                      {category.products?.length}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button onClick={() => setModalOpenExport(false)} variant="outline">
              Cancelar
            </Button>
            <Button disabled={selectedCategories.length === 0}>
              Exportar Productos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                        <SelectItem key={category.id} value={category.id}>
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
                <div
                  onClick={() => setModalOpenExport(true)}
                  className="flex hover:cursor-pointer gap-3 items-center hover:bg-primary hover:text-white hover:[&>svg]:text-white rounded-lg m-1 px-3"
                >
                  <Share />
                  <Button
                    className="hover:bg-transparent hover:text-white"
                    variant={"ghost"}
                  >
                    Exportar
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
