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
  const { uploadFile } = useS3FileManager();
  const navigate = useNavigate();

  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(
    new Set()
  );
  const [image, setImage] = useState<File>({ name: "" } as File);
  const [form, setForm] = useState<formTypes>({
    name: "",
    description: "",
    imgUrl: "",
    brands: [],
    attributes: [],
  });


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
      setImage({ ...image, name: category.imgUrl });
      const tempSet = new Set();

      category.brands!.forEach((brand) => {
        if (brand.id) {
          tempSet.add(brand.id);
        }
      });
      setSelectedBrandIds(tempSet as Set<string>);
    }
  }, [category]);

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
    () =>
      form.name.trim() != "" &&
      form.description.trim() != "" &&
      form.imgUrl?.trim() !== "" &&
      form.brands.length > 0 &&
      form.attributes.length > 0,
    [form]
  );

  const handleSubmit = async (form: formTypes) => {
    try {
      if (category && updateCategory) {
        // Editing existing category
        if (image && image.name !== category.imgUrl) {
          uploadFile(image, async (_, location) => {
            const response = await updateCategory({
              ...category,
              ...form,
              imgUrl: location,
              brands: form.brands.map(id => ({ id } as any)),
            } as Category);
            if (response) {
              navigate("/categorias");
            }
          });
        } else {
          const response = await updateCategory({
            ...category,
            ...form,
            imgUrl: category.imgUrl,
            brands: form.brands.map(id => ({ id } as any)),
          } as Category);
          if (response) {
            navigate("/categorias");
          }
        }
      } else if (addCategory && image) {
        // Creating new category
        uploadFile(image, async (_, location) => {
          const response = (await addCategory({
            ...form,
            imgUrl: location,
            brands: form.brands.map(id => ({ id } as any)),
          } as any)) as { id: string } | undefined;
          if (response && response.id) {
            navigate("/categorias");
          }
        });
      }
    } catch (error) {
      // Error handling
    }
  };

  return (
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
                    placeholder="Gamer Gear Pro Controller"
                    onChange={handleFormInput}
                    value={category ? category.name : form.name}
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
                    value={category ? category.description : form.description}
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
                  <MyDropzone
                    file={image}
                    fileSetter={setImage}
                    className={"p-6"}
                  />
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
          disabled={!validateForm}
          className="h-10 px-6 gap-1"
          onClick={() => handleSubmit(form)}
        >
          <Save className="h-3.5 w-3.5 mr-2" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Guardar
          </span>
        </Button>
      </section>
    </main>
  );
};

export default CategoryCU;
