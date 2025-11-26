import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryContext } from "@/context/categories-context";
import { useBrands } from "@/hooks/useBrands";
import { detailsType } from "@/hooks/useFormProduct";
import { Product } from "@/models/product";

type DetailsCardProps = {
  state: detailsType;
  setState: React.Dispatch<React.SetStateAction<detailsType>>;
  product?: Product | null;
};

const DetailsCard = ({ product, state, setState }: DetailsCardProps) => {
  const { brands } = useBrands();
  const { categories } = useCategoryContext();

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleBrandChange = (value: string) => {
    setState((prevForm) => ({
      ...prevForm,
      brand: value,
      category: "",
    }));
  };

  const handleCategoryChange = (value: string) => {
    setState((prevForm) => ({
      ...prevForm,
      category: value,
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Detalles</CardTitle>
        <CardDescription>
          Ingrese la información deseada de la categoría.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="sku">
              <span className="text-redLabel">*</span>SKU
            </Label>
            <Input
              id="sku"
              name="sku"
              type="text"
              className="w-full"
              placeholder="Gamer Gear Pro Controller"
              onChange={handleFormChange}
              value={product ? product.sku : state.sku}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">
              <span className="text-redLabel">*</span>Description
            </Label>
            <Textarea
              id="description"
              name="description"
              className="w-full"
              placeholder="Gamer Gear Pro Controller"
              value={product ? product.description : state.description}
              onChange={handleFormChange}
            />
          </div>
          <section className="flex gap-4">
            <div className="grid gap-3 w-full">
              <Label htmlFor="brand">
                <span className="text-redLabel">*</span>Marca
              </Label>
              <Select onValueChange={handleBrandChange} value={state.brand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 w-full">
              <Label htmlFor="category">
                <span className="text-redLabel">*</span>Categoría
              </Label>
              <Select
                onValueChange={handleCategoryChange}
                disabled={state.brand === ""}
                value={
                  typeof state.category === "string"
                    ? state.category
                    : state.category?.id || ""
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={product ? product.idCategory : category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
