import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import CardSectionLayout from "@/components/Layouts/CardSectionLayout";
import CardTemplate from "@/components/Layouts/CardTemplate";
import { useBrandContext } from "@/context/brand-context";
import { useBrands } from "@/hooks/useBrands";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";
import { Brand } from "@/models/brand";
import NoData from "@/components/NoData";
import MyDropzone from "@/components/Dropzone";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import Loader from "@/components/Loader";

const Marcas = () => {
  const { brands, brand, loading, addBrand, updateBrand, getBrands, getBrandById } =
    useBrands();
  const { modalState, closeModal, openModal } = useBrandContext();
  const { uploadFile } = useS3FileManager();
  const { isOpen, title, description } = modalState;
  const [image, setImage] = useState<File>({} as File);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savingStartTimeRef = useRef<number | null>(null);

  const [filterBrandSearch, setFilterBrandSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    logoImgUrl: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (image.name !== form.logoImgUrl) {
      setForm({
        ...form,
        logoImgUrl: image.name,
      });
    }
  }, [image]);

  useEffect(() => {
    if (brand && isOpen && isEditMode) {
      setImage({ name: brand.logoImgUrl! } as File);
    }
  }, [brand, isOpen, isEditMode]);

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name || "",
        description: brand.description || "",
        logoImgUrl: brand.logoImgUrl || "",
      });
      setIsEditMode(true);
    } else {
      setForm({
        name: "",
        description: "",
        logoImgUrl: "",
      });
      setIsEditMode(false);
    }
  }, [brand]);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        description: "",
        logoImgUrl: "",
      });
      setImage({} as File);
      setIsEditMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    getBrands();
  }, []);

  const handleForm = (e: any) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    return form.name !== "" && form.description !== "" && form.logoImgUrl;
  };

  const handleSearchFilter = (e: any) => {
    const { value } = e.target;
    setFilterBrandSearch(value.trim());
  };

  const filterBrands = useMemo(
    () =>
      brands.filter((brand: Brand) =>
        brand.name.toLowerCase().includes(filterBrandSearch.toLocaleLowerCase())
      ),
    [brands, filterBrandSearch]
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const startTime = Date.now();
    savingStartTimeRef.current = startTime;
    
    const brandData = {
      ...form,
      id: brand ? brand.id : "",
    };

    const finishSaving = () => {
      const elapsed = savingStartTimeRef.current ? Date.now() - savingStartTimeRef.current : 0;
      const minDisplayTime = 800;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      setTimeout(() => {
        setIsSubmitting(false);
        savingStartTimeRef.current = null;
        closeModal();
      }, remainingTime);
    };

    try {
      if (isEditMode) {
        if (image && image instanceof File && image.name) {
          uploadFile(image, async (_, location) => {
            await updateBrand({ ...brandData, logoImgUrl: location });
            setImage({} as File);
            finishSaving();
          });
        } else {
          await updateBrand(brandData);
          finishSaving();
        }
      } else {
        if (image && image instanceof File && image.name) {
          uploadFile(image, async (_, location) => {
            await addBrand({ ...form, logoImgUrl: location });
            setImage({} as File);
            finishSaving();
          });
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      savingStartTimeRef.current = null;
    }
  };

  const handleOpenModal = (brandToEdit = null) => {
    if (brandToEdit) {
      setIsEditMode(true);
      openModal({
        title: "Editar Marca",
        description: "Edita la marca seleccionada.",
        action: "",
      });
    } else {
      setIsEditMode(false);
      openModal({
        title: "Agregar Marca",
        description: "Agregar una nueva marca al sistema.",
        action: "",
      });
    }
  };

  return (
    <>
      {isSubmitting && (
        <Loader fullScreen message="Guardando cambios..." />
      )}
      <Layout>
      <div>
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row p-0 m-0">
            <div className="flex flex-col gap-3">
              <CardTitle>Marcas</CardTitle>
              <CardDescription>
                Maneja tus marcas y las categorías asociadas a cada una de ellas
              </CardDescription>
            </div>
            <div className="ml-auto flex gap-3">
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar Marca..."
                  onChange={handleSearchFilter}
                  value={filterBrandSearch}
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
              <Dialog
                open={isOpen}
                onOpenChange={(open: boolean) => {
                  if (!open) {
                    setForm({
                      name: "",
                      description: "",
                      logoImgUrl: "",
                    });
                    setIsEditMode(false);
                    closeModal();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="h-10 px-6 gap-1"
                    onClick={() => handleOpenModal()}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-2" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Marca
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {loading && isEditMode ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Cargando marca...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                  <DialogHeader>
                    <DialogTitle className="mb-2">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  <Label htmlFor="name">
                    <span className="text-redLabel">*</span> Nombre
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="ej. Platinum"
                    value={form.name}
                    onChange={handleForm}
                    maxLength={255}
                    required
                  />
                  <Label htmlFor="description">
                    <span className="text-redLabel">*</span> Descripción
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="ej. Marca de lujo"
                    value={form.description}
                    onChange={handleForm}
                    required
                  />
                  <Label htmlFor="logoImgUrl">
                    <span className="text-redLabel">*</span> Imagen
                  </Label>
                  <MyDropzone
                    file={image}
                    fileSetter={setImage}
                    className={`p-8`}
                  />
                  <DialogDescription>
                    Formatos Válidos: jpg, png, jpeg
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      disabled={!validateForm() || isSubmitting}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      {isSubmitting ? "Guardando..." : isEditMode ? "Actualizar Marca" : "Agregar Marca"}
                    </Button>
                  </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Cargando...</p>
              </div>
            </div>
          ) : brands.length === 0 || filterBrands.length === 0 ? (
            <div className="mt-4">
              <NoData>
                <AlertTriangle className="text-[#4E5154]" />
                <p className="text-[#4E5154]">
                  No se ha encontrado ninguna marca
                </p>
                <p className="text-[#94A3B8] font-semibold text-sm">
                  Agrega uno en la parte posterior
                </p>
              </NoData>
            </div>
          ) : (
            <CardSectionLayout>
              {(filterBrands.length > 0 ? filterBrands : brands).map(
                (brand) => (
                  <CardTemplate
                    key={brand.id}
                    brand={brand}
                    getBrandById={getBrandById}
                    getItems={getBrands}
                  />
                )
              )}
            </CardSectionLayout>
          )}
        </Card>
      </div>
    </Layout>
    </>
  );
};

export default Marcas;
