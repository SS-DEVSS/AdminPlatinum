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
import MyDropzone from "@/components/Dropzone";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useState, useEffect } from "react";

type DetailsCardProps = {
  state: detailsType;
  setState: React.Dispatch<React.SetStateAction<detailsType>>;
  product?: Product | null;
};

const DetailsCard = ({ product, state, setState }: DetailsCardProps) => {
  const { brands } = useBrands();
  const { categories } = useCategoryContext();
  const { uploadFile, uploading } = useS3FileManager();
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [imageUrl, setImageUrl] = useState<string>(state.imgUrl || "");

  // Update imageUrl when state.imgUrl changes (e.g., when loading product data)
  useEffect(() => {
    if (state.imgUrl && !imageFile.name) {
      setImageUrl(state.imgUrl);
    }
  }, [state.imgUrl]);

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
      category: null,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value);
    setState((prevForm) => ({
      ...prevForm,
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
    }));
  };

  useEffect(() => {
    if (imageFile && imageFile.name) {
      uploadFile(imageFile, (key: string, location: string) => {
        setImageUrl(location);
        // Store the full URL (location) instead of just the key
        // The backend can handle both URL and path
        setState((prevForm) => ({
          ...prevForm,
          imgUrl: location, // Use location (full URL) instead of key
        }));
      });
    }
  }, [imageFile]);

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
              value={state.sku}
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
              value={state.description}
              onChange={handleFormChange}
            />
          </div>
          <section className="flex gap-4">
            <div className="grid gap-3 w-full">
              <Label htmlFor="brand">
                <span className="text-redLabel">*</span>Marca
              </Label>
              <Select onValueChange={handleBrandChange} value={state.brand || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id || ""}>
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
                    ? state.category || ""
                    : (state.category?.id || "")
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
                        value={category.id || ""}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          <div className="grid gap-3">
            <Label htmlFor="image">
              <span className="text-redLabel">*</span>Imagen del Producto
            </Label>
            <MyDropzone
              file={imageFile}
              fileSetter={setImageFile}
              type="image"
              className="p-8 min-h-[200px]"
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            )}
            {imageUrl && !imageFile.name && (
              <div className="mt-2">
                <img src={imageUrl} alt="Producto" className="max-w-[200px] rounded-md" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
