import MyDropzone from "@/components/Dropzone";
import CardSectionLayout from "@/components/Layouts/CardSectionLayout";
import Layout from "@/components/Layouts/Layout";
import NoData from "@/components/NoData";
import TsCard from "@/components/TsCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useTs } from "@/hooks/useTs";
import { Variant } from "@/models/item";
import { TechnicalSheet } from "@/models/technicalSheet";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const dummy: Variant[] = [
  {
    id: "b7161ff2-6da6-412c-9f0b-cd315bb84a49",
    idProduct: "f608614e-f5ef-42ec-949d-fd9013e4711b",
    name: "ENGINE001",
    sku: "ENG001",
    price: 123,
    stockQuantity: 5,

    images: [
      {
        id: "bc567f41-a788-48c2-a11e-55599e5f7eb0",
        url: "https://ss-platinum-driveline-api.s3.amazonaws.com/uploads/images/f1ef5864-44a6-4b91-8937-faf719a4a109.jpg",
        order: 1,
      },
    ],
  },
  {
    id: "b7161ff2-6da6-412c-9f0b-cd315bb84a48",
    idProduct: "f608614e-f5ef-42ec-949d-fd9013e4711b",
    name: "ENGINE001",
    sku: "ENG001",
    price: 123,
    stockQuantity: 5,

    images: [
      {
        id: "bc567f41-a788-48c2-a11e-55599e5f7eb0",
        url: "https://ss-platinum-driveline-api.s3.amazonaws.com/uploads/images/f1ef5864-44a6-4b91-8937-faf719a4a109.jpg",
        order: 1,
      },
    ],
  },
  {
    id: "b7161ff2-6da6-412c-9f0b-cd315bb84a47",
    idProduct: "f608614e-f5ef-42ec-949d-fd9013e4711b",
    name: "ENGINE001",
    sku: "ENG001",
    price: 123,
    stockQuantity: 5,

    images: [
      {
        id: "bc567f41-a788-48c2-a11e-55599e5f7eb0",
        url: "https://ss-platinum-driveline-api.s3.amazonaws.com/uploads/images/f1ef5864-44a6-4b91-8937-faf719a4a109.jpg",
        order: 1,
      },
    ],
  },
];

export interface TSFormType {
  title: string;
  path?: string;
  url?: string;
  imgUrl?: string | null;
  description: string;
  variant?: Variant | null;
}

const TsFormInitialState = {
  title: "",
  path: "",
  url: "",
  imgUrl: null,
  description: "",
  variant: null,
};

const TechincalSheets = () => {
  const {
    loading,
    technicalSheet,
    technicalSheets,
    addTechnicalSheet,
    getTsById,
    deleteTechnicalSheet,
  } = useTs();
  const { uploadFile } = useS3FileManager();

  const [searchFilter, setSearchFilter] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tsForm, setTsForm] = useState<TSFormType>(TsFormInitialState);
  const [file, setFile] = useState<File>({ name: "" } as File);
  const [image, setImage] = useState<File>({} as File);

  const toggleModal = async () => {
    setIsOpen(!isOpen);
    if (!isEditMode) {
      await setTsForm({ ...TsFormInitialState, path: "" });
    }
  };

  //   Crear

  useEffect(() => {
    setFile({} as File);
    setImage({} as File);
  }, [isEditMode]);

  useEffect(() => {
    if (file?.name && tsForm.path !== file.name) {
      setTsForm((prev) => ({ ...prev, path: file.name }));
    }
  }, [file, tsForm.path]);

  const validateForm = useMemo(
    () =>
      tsForm.title.trim() !== "" &&
      tsForm.description.trim() !== "" &&
      tsForm!.path!.trim() !== "",
    [tsForm]
  );

  const handleFileUpload = async (
    file: File | null
  ): Promise<string | null> => {
    if (!file || file.name === undefined) {
      return null;
    }
    return new Promise((resolve, reject) => {
      uploadFile(file, (key) => resolve(key)).catch((error) => reject(error));
    });
  };

  const handleSubmit = async () => {
    try {
      if (!isEditMode) {
        const [fileKey, imageKey] = await Promise.all([
          handleFileUpload(file),
          handleFileUpload(image),
        ]);

        const payload = {
          ...tsForm,
          path: fileKey || undefined,
          imgUrl: imageKey || undefined,
        };
        await addTechnicalSheet(payload);
      }
    } catch (error) {
      console.error("Error during file upload or submit:", error);
    } finally {
      setTsForm(TsFormInitialState);
      setFile({} as File);
      setImage({} as File);
      setIsEditMode(false);
      toggleModal();
    }
  };

  const handleForm = (e: any) => {
    const { name, value } = e.target;
    setTsForm({
      ...tsForm,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isEditMode && technicalSheet) {
      setFile({ name: technicalSheet.url || "" } as File);
      setIsEditMode(true);
      setIsOpen(true);
    }
  }, [technicalSheet]);

  //   Read

  const handleSearchFilter = (e: any) => {
    const { value } = e.target;
    setSearchFilter(value);
  };

  const filteredTs = useMemo(
    () =>
      technicalSheets.filter((ts: TechnicalSheet) =>
        ts.title.toLowerCase().includes(variantFilter.toLocaleLowerCase())
      ),
    [searchFilter, technicalSheets]
  );

  return (
    <Layout>
      <Card className="border-0 shadow-none flex flex-col">
        <CardHeader className="flex flex-row p-0 m-0">
          <div className="flex flex-col gap-3">
            <CardTitle>Boletínes</CardTitle>
            <CardDescription>Maneja tus boletínes</CardDescription>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar Boletín..."
                onChange={handleSearchFilter}
                value={searchFilter}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Dialog
              open={isOpen}
              onOpenChange={(open: boolean) => {
                if (!open) {
                  setTsForm(TsFormInitialState);
                  setIsEditMode(false);
                  setIsOpen(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-10 px-6 gap-1"
                  onClick={toggleModal}
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Boletín
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[2000px]">
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    {isEditMode ? "Editar Boletín" : "Agregar Boletín"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode ? "Editar Boletín" : "Agregar Boletín"}
                  </DialogDescription>
                </DialogHeader>
                <section className="w-full flex gap-4">
                  <div className="w-full">
                    <Label htmlFor="title" className="block mb-2">
                      <span className="text-redLabel">*</span> Título
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="ej. Platinum"
                      value={tsForm.title}
                      onChange={handleForm}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="description" className="block mb-2">
                      <span className="text-redLabel">*</span> Descripción
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="ej. Platinum"
                      value={tsForm.description}
                      onChange={handleForm}
                      maxLength={526}
                      required
                    />
                  </div>
                </section>
                <section className="flex gap-4">
                  <div>
                    <Label htmlFor="path" className="block mb-2">
                      <span className="text-redLabel">*</span> Documento
                    </Label>
                    <MyDropzone
                      className={"p-8"}
                      file={file}
                      fileSetter={setFile}
                      type={"document"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="path" className="block mb-2">
                      <span className="text-redLabel"></span> Imágen de Portada
                    </Label>
                    <MyDropzone
                      className={"p-8"}
                      file={image}
                      fileSetter={setImage}
                    />
                  </div>
                </section>
                <Label htmlFor="logoImgUrl">Variante</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="ej. Platinum"
                  value={variantFilter}
                  onChange={(e) => setVariantFilter(e.target.value)}
                  maxLength={526}
                  required
                />

                {dummy.map((variantDisplay: Variant) => (
                  <Card
                    key={variantDisplay.id}
                    className="flex flex-row items-center"
                  >
                    <CardHeader>
                      <Checkbox
                        id="variant"
                        onCheckedChange={(e) => {
                          if (e === true) {
                            setTsForm({
                              ...tsForm,
                              variant: variantDisplay,
                            });
                          } else {
                            setTsForm({
                              ...tsForm,
                              variant: null,
                            });
                          }
                        }}
                        checked={
                          tsForm.variant === variantDisplay ? true : false
                        }
                        className="border-slate-400"
                      />
                    </CardHeader>
                    <Separator
                      orientation="vertical"
                      className="w-0.5 bg-slate-100"
                    />
                    <CardContent className="p-3">
                      <img
                        className="w-16 aspect-square rounded-sm"
                        src={variantDisplay.images![0].url}
                      />
                    </CardContent>
                    <CardContent className="mt-2">
                      <p className="text-slate-400 text-sm font-light">
                        <span className="select-none">#</span>
                        {variantDisplay.id}
                      </p>
                      <p className="mt-2">{variantDisplay.name}</p>
                    </CardContent>
                  </Card>
                ))}
                <DialogFooter>
                  <Button
                    disabled={!validateForm}
                    onClick={handleSubmit}
                    type="submit"
                  >
                    {isEditMode ? "Actualizar Marca" : "Agregar Marca"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Cargando...</p>
              </div>
            </div>
          ) : technicalSheets.length === 0 || filteredTs.length === 0 ? (
            <div className="mt-4">
              <NoData>
                <AlertTriangle className="text-[#4E5154]" />
                <p className="text-[#4E5154]">No se ha creado ningún boletín</p>
                <p className="text-[#94A3B8] font-semibold text-sm">
                  Agrega uno en la parte posterior
                </p>
              </NoData>
            </div>
          ) : (
            <CardSectionLayout>
              {(searchFilter.length > 0 ? filteredTs : technicalSheets).map(
                (ts: TechnicalSheet) => (
                  <TsCard
                    key={ts.id}
                    ts={ts}
                    getTsById={getTsById}
                    deleteTechnicalSheet={deleteTechnicalSheet}
                    setIsEditMode={setIsEditMode}
                    setTsForm={setTsForm}
                  />
                )
              )}
            </CardSectionLayout>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TechincalSheets;
