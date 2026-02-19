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
import { useSubcategories } from "@/hooks/useSubcategories";
import type { SubcategoryTreeNode } from "@/models/subcategory";
import { detailsType } from "@/hooks/useFormProduct";
import { Product } from "@/models/product";
import MyDropzone from "@/components/Dropzone";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";
import FeatureProductModal from "./FeatureProductModal";
import { Star, FolderOpen } from "lucide-react";
import FilePickerModal from "@/components/files/FilePickerModal";

type DetailsCardProps = {
  state: detailsType;
  setState: React.Dispatch<React.SetStateAction<detailsType>>;
  product?: Product | null;
};

function flattenSubcategoryTree(
  nodes: SubcategoryTreeNode[],
  path: string[] = []
): { id: string; name: string; label: string }[] {
  const result: { id: string; name: string; label: string }[] = [];
  for (const node of nodes) {
    const currentPath = [...path, node.name];
    const label = currentPath.join(" › ");
    result.push({ id: node.id, name: node.name, label });
    if (node.children?.length) {
      result.push(...flattenSubcategoryTree(node.children, currentPath));
    }
  }
  return result;
}

const DetailsCard = ({ state, setState, product }: DetailsCardProps) => {
  const { brands } = useBrands();
  const { categories } = useCategoryContext();
  const { getTree } = useSubcategories();
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; label: string }[]>([]);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const { uploadFile, uploading } = useS3FileManager();
  const { toast } = useToast();
  const client = axiosClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(state.imgUrl || "");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [filePickerOpen, setFilePickerOpen] = useState(false);

  useEffect(() => {
    if (state.imgUrl && !imageFile) setImageUrl(state.imgUrl);
  }, [state.imgUrl, imageFile]);

  useEffect(() => {
    if (product && state.imgUrl) {
      setImageFile((currentFile) => {
        if (currentFile && !(currentFile instanceof File && currentFile.name)) return null;
        return currentFile;
      });
    }
  }, [product, state.imgUrl, imageUrl, imageFile]);

  useEffect(() => {
    if (state.category) {
      const categoryId = typeof state.category === 'string' ? state.category : state.category.id;
      const selectedCategory = categories.find((cat) => cat.id === categoryId);

      if (selectedCategory?.brands && selectedCategory.brands.length > 0) {
        const categoryBrandId = selectedCategory.brands[0].id || "";
        // Only update if brand is not already set or is different
        setState((prevForm) => {
          if (prevForm.brand !== categoryBrandId) {
            return {
              ...prevForm,
              brand: categoryBrandId,
            };
          }
          return prevForm;
        });
      }
    }
  }, [state.category, categories, setState, state.brand]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const categoryId = typeof state.category === "string" ? state.category : state.category?.id;

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    getTree(categoryId).then((tree) =>
      setSubcategories(flattenSubcategoryTree(tree))
    );
  }, [categoryId, getTree]);

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value);
    const categoryBrandId = selectedCategory?.brands && selectedCategory.brands.length > 0
      ? selectedCategory.brands[0].id || ""
      : "";

    setState((prevForm) => ({
      ...prevForm,
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
      subcategory: null,
      brand: categoryBrandId,
    }));
  };

  const handleSubcategoryChange = (value: string) => {
    const selected = subcategories.find((s) => s.id === value);
    setState((prevForm) => ({
      ...prevForm,
      subcategory: selected ? { id: selected.id, name: selected.label } : null,
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
    } else if (!imageFile && !state.imgUrl) {
      // Only clear imageUrl if there's no existing image (not editing)
      // When editing, we want to keep the existing imageUrl
      setImageUrl("");
    }
  }, [imageFile, uploadFile, setState, state.imgUrl]);

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
      toast({
        title: "Error al eliminar imagen",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error desconocido",
      });
    }
  };

  const handleFileSelect = (fileUrl: string) => {
    setImageFile(null);
    setImageUrl(fileUrl);
    setState((prevForm) => ({
      ...prevForm,
      imgUrl: fileUrl,
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Detalles</CardTitle>
        <CardDescription>
          Ingrese los detalles
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">
              Nombre<span className="text-redLabel">*</span>
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
              SKU<span className="text-redLabel">*</span>
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
              Descripción<span className="text-redLabel">*</span>
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
          <section className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-3 min-w-[200px] flex-1">
              <Label htmlFor="brand">Marca</Label>
              <Select value={state.brand || "none"} disabled>
                <SelectTrigger className="w-full bg-muted cursor-not-allowed">
                  <SelectValue placeholder="Selecciona una marca (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    <SelectItem value="none">Sin marca</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id || ""}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                La marca se asigna automáticamente desde la categoría seleccionada
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px] flex-1">
              <Label htmlFor="category">
                Categoría<span className="text-redLabel">*</span>
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
                      <SelectItem key={category.id} value={category.id || ""}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          {categoryId && (
            <div className="flex flex-col gap-3 w-full max-w-full">
              <Label htmlFor="subcategory">Subcategoría (opcional)</Label>
              <Select
                onValueChange={(v) => handleSubcategoryChange(v === "__none__" ? "" : v)}
                value={state.subcategory?.id ? String(state.subcategory.id) : "__none__"}
              >
                <SelectTrigger
                  className="w-full min-h-10 text-left"
                  title={state.subcategory?.name ?? undefined}
                >
                  <SelectValue placeholder="Selecciona una subcategoría" />
                </SelectTrigger>
                <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                  <SelectGroup>
                    <SelectLabel>Subcategorías</SelectLabel>
                    <SelectItem value="__none__">Ninguna</SelectItem>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id} className="whitespace-normal py-2">
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Puedes elegir una subcategoría de cualquier nivel. Se muestra la ruta completa (ej. Raíz › Nivel 2 › Nivel 3).
              </p>
            </div>
          )}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="image">
                Imagen<span className="text-redLabel">*</span>
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilePickerOpen(true)}
                type="button"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Buscar en archivos
              </Button>
            </div>
            <div className="relative">
              <MyDropzone
                file={imageFile || undefined}
                fileSetter={setImageFile}
                type="image"
                className="p-8 min-h-[200px]"
                currentImageUrl={(() => {
                  const url = imageUrl && !imageFile ? imageUrl : undefined;
                  return url;
                })()}
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
          {product && (
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant={product.isFeatured ? "default" : "outline"}
                onClick={() => setFeatureModalOpen(true)}
                className="w-full"
              >
                <Star className={`h-4 w-4 mr-2 ${product.isFeatured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                {product.isFeatured ? "Editar Producto Destacado" : "Destacar Producto"}
              </Button>
              {product.isFeatured && (
                <p className="text-xs text-muted-foreground">
                  Este producto está destacado y se muestra en la página principal.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <FeatureProductModal
        open={featureModalOpen}
        onOpenChange={setFeatureModalOpen}
        product={product || null}
        applications={(product as any)?.applications || []}
        isCurrentlyFeatured={product?.isFeatured || false}
        currentFeaturedApplicationId={product?.featuredApplicationId || null}
        onSuccess={() => {
          window.location.reload();
        }}
      />
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
      <FilePickerModal
        open={filePickerOpen}
        onOpenChange={setFilePickerOpen}
        onSelectFile={handleFileSelect}
        filterType="image"
      />
    </Card>
  );
};

export default DetailsCard;
