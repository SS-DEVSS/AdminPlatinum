import MyDropzone from "@/components/Dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBrandContext } from "@/context/brand-context";
import { useBrands } from "@/hooks/useBrands";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { Category, CategoryAtributes } from "@/models/category";
import {
  ChevronLeft,
  PlusCircleIcon,
  XCircleIcon,
  Info,
  Save,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardAtributesVariants from "./CardAtributesVariants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

type CategoryCUProps = {
  category?: Category | null;
  addCategory?: (category: Omit<Category, "id">) => void;
  updateCategory?: (category: Category) => void | Promise<any>;
};

export interface formTypes {
  name: string;
  description: string;
  imgUrl: string;
  brands: string[];
  attributes: CategoryAtributes[];
}

const CategoryCU = ({ category, addCategory, updateCategory }: CategoryCUProps) => {
  const { selectedBrand } = useBrandContext();
  const { brands } = useBrands();
  const { uploadFile, uploading } = useS3FileManager();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(
    new Set()
  );
  const [image, setImage] = useState<File>({ name: "" } as File);
  const [imageUrl, setImageUrl] = useState<string>(category?.imgUrl || "");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [form, setForm] = useState<formTypes>({
    name: "",
    description: "",
    imgUrl: "",
    brands: [],
    attributes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingStartTime, setSavingStartTime] = useState<number | null>(null);


  useEffect(() => {
    if (selectedBrand) {
      setSelectedBrandIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedBrand);
        return newSet;
      });
      setForm({
        ...form,
        brands: [...form.brands, selectedBrand],
      });
    }
  }, []);

  useEffect(() => {
    if (category) {
      // Transformar attributes si viene como objeto (CategoryResponse) a array plano
      let attributesArray: CategoryAtributes[] = [];
      if (category.attributes) {
        if (Array.isArray(category.attributes)) {
          // Ya es un array
          attributesArray = category.attributes;
        } else if (typeof category.attributes === 'object') {
          // Es un objeto con product, variant, application, etc.
          const attrsObj = category.attributes as any;
          attributesArray = [
            ...(attrsObj.product || []),
            ...(attrsObj.variant || []),
            ...(attrsObj.reference || []),
            ...(attrsObj.application || []),
          ];
        }
      }

      setForm({
        ...category,
        brands: category.brands?.map(b => b.id).filter((id): id is string => !!id) || [],
        attributes: attributesArray,
      });
      // No establecer image.name con la URL, solo imageUrl
      setImage({ name: "" } as File);
      setImageUrl(category.imgUrl || "");
      const tempSet = new Set();

      category.brands!.forEach((brand) => {
        if (brand.id) {
          tempSet.add(brand.id);
        }
      });
      setSelectedBrandIds(tempSet as Set<string>);
    }
  }, [category]);

  // Update imageUrl when image is uploaded
  useEffect(() => {
    if (image && image.name && image.name !== category?.imgUrl && image instanceof File) {
      uploadFile(image, (_key: string, location: string) => {
        setImageUrl(location);
        setForm((prevForm) => ({
          ...prevForm,
          imgUrl: location,
        }));
      });
    }
  }, [image]);

  const handlePreviewImage = (url: string) => {
    setPreviewImageUrl(url);
    setPreviewDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!category?.id) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "No se puede eliminar la imagen sin un ID de categoría",
      });
      return;
    }

    try {
      // Limpiar la imagen del estado
      setImageUrl("");
      setImage({ name: "" } as File);
      setForm((prevForm) => ({
        ...prevForm,
        imgUrl: "",
      }));

      toast({
        title: "Imagen eliminada correctamente",
        variant: "success",
        description: "La imagen se eliminará al guardar los cambios",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar imagen",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error desconocido",
      });
    }
  };

  useEffect(() => {
    if (image.name !== form.imgUrl) {
      setForm({
        ...form,
        imgUrl: image.name,
      });
    }
  }, [image]);

  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleBrandSelection = (brandId: string) => {
    setForm({
      ...form,
      brands: [...form.brands, brandId],
    });
    setSelectedBrandIds((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(brandId)) {
        updatedSet.delete(brandId);
      } else {
        updatedSet.add(brandId);
      }
      return updatedSet;
    });
  };

  const validateForm = useMemo(
    () => {
      // Validación básica: nombre y descripción siempre requeridos
      const basicValidation = form.name.trim() !== "" && form.description.trim() !== "";

      // Si es una categoría nueva, requiere imagen, brands y attributes
      if (!category) {
        return (
          basicValidation &&
          (form.imgUrl?.trim() !== "" || imageUrl?.trim() !== "") &&
          form.brands.length > 0 &&
          form.attributes.length > 0
        );
      }

      // Si es edición, solo requiere nombre y descripción
      // La imagen puede estar vacía si se eliminó, pero eso se maneja en el submit
      return basicValidation;
    },
    [form, category, imageUrl]
  );

  const handleSubmit = async (form: formTypes) => {
    try {
      setIsSubmitting(true);
      setSavingStartTime(Date.now());
      if (category && updateCategory) {
        // Editing existing category - formato según Postman
        const originalBrandIds = category.brands?.map(b => b.id).filter((id): id is string => !!id) || [];
        const currentBrandIds = form.brands;
        const brandsToAdd = currentBrandIds.filter(id => !originalBrandIds.includes(id));
        const brandsToDelete = originalBrandIds.filter(id => !currentBrandIds.includes(id));

        // Transformar attributes de objeto a array si es necesario
        let originalAttributesArray: CategoryAtributes[] = [];
        if (category.attributes) {
          if (Array.isArray(category.attributes)) {
            originalAttributesArray = category.attributes;
          } else if (typeof category.attributes === 'object') {
            // Es un objeto con product, variant, application, etc.
            const attrsObj = category.attributes as any;
            originalAttributesArray = [
              ...(attrsObj.product || []),
              ...(attrsObj.variant || []),
              ...(attrsObj.reference || []),
              ...(attrsObj.application || []),
            ];
          }
        }

        const originalAttributeIds = originalAttributesArray.map(attr => attr.id).filter((id): id is string => !!id);
        const currentAttributeIds = form.attributes.map(attr => attr.id).filter((id): id is string => !!id);
        const attributesToAdd = form.attributes
          .filter(attr => !attr.id || !originalAttributeIds.includes(attr.id))
          .map(attr => ({
            name: attr.display_name || attr.name,
            csvName: attr.csv_name || attr.name,
            displayName: attr.display_name || attr.name,
            type: attr.type,
            required: attr.required,
            order: attr.order,
            scope: attr.scope.toLowerCase(), // "PRODUCT" -> "product"
          }));
        const attributesToDelete = originalAttributeIds.filter(id => !currentAttributeIds.includes(id));

        const updatePayload: any = {
          name: form.name,
          description: form.description,
          imgUrl: imageUrl || category.imgUrl, // Usar imageUrl si está disponible, sino la original
        };

        // Solo incluir brands si hay cambios
        if (brandsToAdd.length > 0 || brandsToDelete.length > 0) {
          updatePayload.brands = {};
          if (brandsToAdd.length > 0) {
            updatePayload.brands.add = brandsToAdd;
          }
          if (brandsToDelete.length > 0) {
            // El backend espera 'remove' aunque el validador acepta 'delete'
            updatePayload.brands.remove = brandsToDelete;
          }
        }

        // Solo incluir attributes si hay cambios
        if (attributesToAdd.length > 0 || attributesToDelete.length > 0) {
          updatePayload.attributes = {};
          if (attributesToAdd.length > 0) {
            updatePayload.attributes.add = attributesToAdd;
          }
          if (attributesToDelete.length > 0) {
            updatePayload.attributes.delete = attributesToDelete;
          }
        }

        // Si hay una nueva imagen (File object), subirla primero
        if (image && image instanceof File && image.name && image.name !== category.imgUrl) {
          uploadFile(image, async (_, location) => {
            const response = await updateCategory({
              id: category.id, // El ID va en el objeto Category para la URL
              ...updatePayload,
              imgUrl: location,
            } as any);
            if (response) {
              navigate("/categorias");
            }
          });
        } else {
          // Si no hay nueva imagen, actualizar directamente
          // Si imageUrl está vacío, significa que se eliminó la imagen
          if (!imageUrl && category.imgUrl) {
            updatePayload.imgUrl = null;
          }
          const response = await updateCategory({
            id: category.id, // El ID va en el objeto Category para la URL
            ...updatePayload,
          } as any);
          if (response) {
            navigate("/categorias");
          }
        }
      } else if (addCategory && image) {
        // Creating new category - formato según Postman
        uploadFile(image, async (_, location) => {
          const createPayload = {
            name: form.name,
            description: form.description,
            imgUrl: location,
            brands: form.brands, // Array de strings (IDs)
            attributes: form.attributes.map(attr => ({
              name: attr.display_name || attr.name,
              csvName: attr.csv_name || attr.name,
              displayName: attr.display_name || attr.name,
              type: attr.type,
              required: attr.required,
              order: attr.order,
              scope: attr.scope, // "PRODUCT", "APPLICATION" (mayúsculas)
            })),
          };

          const response = (await addCategory(createPayload as any)) as { id: string } | undefined;
          if (response && response.id) {
            navigate("/categorias");
          }
        });
      }
    } catch (error: any) {
      // Error handling - el error ya se maneja en updateCategory/addCategory
    } finally {
      // Ensure loader is shown for at least 800ms for better UX
      const elapsed = savingStartTime ? Date.now() - savingStartTime : 0;
      const minDisplayTime = 800;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setSavingStartTime(null);
      }, remainingTime);
    }
  };

  return (
    <>
      {isSubmitting && (
        <Loader fullScreen message="Guardando cambios..." />
      )}
      <main>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/categorias">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {!category ? "Nueva Categoría" : `${category.name}`}
          </p>
        </div>
      </header>
      <section>
        <section className="mt-4 flex flex-col md:flex-row justify-between gap-3 w-full">
          <Card x-chunk="dashboard-07-chunk-0" className="w-1/2">
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
              <CardDescription>
                Ingrese la información deseada de la categoría.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>El nombre de la categoría que se mostrará en el sistema</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full"
                    placeholder="Clutch, Frenos..."
                    onChange={handleFormInput}
                    value={form.name}
                    maxLength={255}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Una descripción breve de la categoría y su propósito</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Lorem ipsum dolor sit amet."
                    onChange={handleFormInput}
                    value={form.description}
                    className="min-h-20"
                    maxLength={255}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="image">Imagen de la Categoría</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>La imagen representativa de la categoría que se mostrará en el catálogo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <MyDropzone
                      file={image}
                      fileSetter={setImage}
                      type="image"
                      className="p-8 min-h-[200px]"
                      currentImageUrl={imageUrl && !image.name ? imageUrl : undefined}
                      onImageClick={() => {
                        if (imageUrl && !image.name) {
                          handlePreviewImage(imageUrl);
                        }
                      }}
                    />
                    {imageUrl && !image.name && category?.id && (
                      <div className="mt-3 flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewImage(imageUrl)}
                          type="button"
                        >
                          Previsualizar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteImage}
                          disabled={uploading}
                          type="button"
                        >
                          Eliminar Imagen
                        </Button>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <section className="w-1/2 flex flex-col justify-between gap-4">
            <Card x-chunk="dashboard-07-chunk-0" className="flex-grow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Asociar a Marcas</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Las marcas asociadas a esta categoría. Los productos de estas marcas podrán usar esta categoría como template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>
                  Selecciones una marca si desea asociarla a la categoría.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Marcas Asociadas:</CardTitle>
                <section className="flex mt-4 gap-3">
                  {[...selectedBrandIds].map((id) => {
                    const brand = brands.find((brand) => brand.id === id);
                    return brand ? (
                      <Badge
                        className="text-base px-5 py-2 flex gap-3"
                        key={brand.id}
                      >
                        {brand.name}
                        <XCircleIcon
                          onClick={() => toggleBrandSelection(brand.id!)}
                          className="hover:cursor-pointer"
                        />
                      </Badge>
                    ) : null;
                  })}
                </section>
              </CardContent>
              <Separator />
              <CardContent>
                <CardTitle className="text-base my-5">
                  Marcas por explorar:
                </CardTitle>
                <section className="flex gap-3 flex-wrap">
                  {brands.map((brand) => {
                    const isSelected = selectedBrandIds.has(brand.id!);
                    return (
                      <Badge
                        key={brand.id}
                        variant={`${isSelected ? "default" : "secondary"}`}
                        className="text-base px-5 py-2 flex gap-3"
                      >
                        {brand.name}
                        {!isSelected ? (
                          <PlusCircleIcon
                            onClick={() => toggleBrandSelection(brand.id!)}
                            className="hover:cursor-pointer"
                          />
                        ) : (
                          <XCircleIcon
                            onClick={() => toggleBrandSelection(brand.id!)}
                            className="hover:cursor-pointer"
                          />
                        )}
                      </Badge>
                    );
                  })}
                </section>
              </CardContent>
            </Card>
          </section>
        </section>
      </section>
      <section className="mt-4 flex flex-col gap-3 w-full">
        <CardAtributesVariants
          form={form}
          setForm={setForm}
          title={"Atributos de Producto"}
          description={"Ingresa los atributos de producto para esta categoría"}
        />
        <CardAtributesVariants
          form={form}
          setForm={setForm}
          title={"Atributos de Aplicaciones"}
          description={"Ingresa los atributos de aplicación para esta categoría"}
        />
      </section>
      <section className="mt-6 flex justify-end gap-3">
        <Link to="/categorias">
          <Button variant={"outline"}>Cancelar</Button>
        </Link>
        <Button
          size="sm"
          disabled={!validateForm || isSubmitting}
          className="h-10 px-6 gap-1"
          onClick={() => handleSubmit(form)}
        >
          <Save className="h-3.5 w-3.5 mr-2" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {isSubmitting ? "Guardando..." : "Guardar"}
          </span>
        </Button>
      </section>
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
    </main>
    </>
  );
};

export default CategoryCU;
