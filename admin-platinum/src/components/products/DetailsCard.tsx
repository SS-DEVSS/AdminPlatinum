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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategoryContext } from "@/context/categories-context";
import { useBrands } from "@/hooks/useBrands";
import { detailsType } from "@/hooks/useFormProduct";
import { Product } from "@/models/product";
import MyDropzone from "@/components/Dropzone";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";

type DetailsCardProps = {
  state: detailsType;
  setState: React.Dispatch<React.SetStateAction<detailsType>>;
  product?: Product | null;
};

const DetailsCard = ({ state, setState }: DetailsCardProps) => {
  const { brands } = useBrands();
  const { categories } = useCategoryContext();
  const { uploadFile, uploading } = useS3FileManager();
  const { toast } = useToast();
  const client = axiosClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(state.imgUrl || "");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");

  // Update imageUrl when state.imgUrl changes (e.g., when loading product data)
  useEffect(() => {
    if (state.imgUrl && !imageFile) {
      setImageUrl(state.imgUrl);
    }
  }, [state.imgUrl, imageFile]);

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
      brand: value === "none" ? "" : value, // Convert "none" to empty string for backend
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

  // Upload image immediately when selected (same behavior for create and edit)
  useEffect(() => {
    if (imageFile && imageFile.name) {
      uploadFile(imageFile, (_key: string, location: string) => {
        setImageUrl(location);
        // Store the full URL (location) instead of just the key
        // The backend can handle both URL and path
        setState((prevForm) => ({
          ...prevForm,
          imgUrl: location, // Use location (full URL) instead of key
        }));
      });
    } else if (!imageFile) {
      setImageUrl("");
    }
  }, [imageFile, uploadFile, setState]);

  const handlePreviewImage = (url: string) => {
    setPreviewImageUrl(url);
    setPreviewDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!state.id) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "No se puede eliminar la imagen sin un ID de producto",
      });
      return;
    }

    try {
      await client.delete(`/products/${state.id}/images`);

      // Limpiar la imagen del estado
      setImageUrl("");
      setState((prevForm) => ({
        ...prevForm,
        imgUrl: "",
      }));

      toast({
        title: "Imagen eliminada correctamente",
        variant: "success",
      });
    } catch (error: any) {
      console.error("[DetailsCard] Error deleting image:", error);
      toast({
        title: "Error al eliminar imagen",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error desconocido",
      });
    }
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
            <Label htmlFor="name">
              <span className="text-redLabel">*</span>Nombre del Producto
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              className="w-full"
              placeholder="Nombre del producto"
              onChange={handleFormChange}
              value={state.name}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sku">
              <span className="text-redLabel">*</span>SKU
            </Label>
            <Input
              id="sku"
              name="sku"
              type="text"
              className="w-full"
              placeholder="SKU"
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
              placeholder="Descripción del producto"
              value={state.description}
              onChange={handleFormChange}
            />
          </div>
          <section className="flex gap-4">
            <div className="grid gap-3 w-full">
              <Label htmlFor="brand">
                Marca
              </Label>
              <Select onValueChange={handleBrandChange} value={state.brand || "none"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una marca (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    <SelectItem value="none">
                      Sin marca
                    </SelectItem>
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
            <div className="relative">
              <MyDropzone
                file={imageFile || undefined}
                fileSetter={setImageFile}
                type="image"
                className="p-8 min-h-[200px]"
                currentImageUrl={imageUrl && !imageFile ? imageUrl : undefined}
                onImageClick={() => {
                  if (imageUrl && !imageFile) {
                    handlePreviewImage(imageUrl);
                  }
                }}
              />
              {imageUrl && !imageFile && (
                <div className="mt-3 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewImage(imageUrl)}
                    type="button"
                  >
                    Previsualizar
                  </Button>
                  {state.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteImage}
                      disabled={uploading}
                      type="button"
                    >
                      Eliminar Imagen
                    </Button>
                  )}
                </div>
              )}
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>
            )}
          </div>
        </div>
      </CardContent>
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vista Previa de Imagen</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Vista previa"
                className="max-w-full max-h-[500px] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DetailsCard;
