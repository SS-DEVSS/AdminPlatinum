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
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useTs } from "@/hooks/useTs";
import { Variant } from "@/models/item";
import { TechnicalSheet } from "@/models/technicalSheet";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface TSFormType {
  title: string;
  path?: string;
  url?: string;
  description: string;
  variant?: Variant | null;
}

const TsFormInitialState = {
  title: "",
  path: "",
  url: "",
  description: "",
  variant: {} as Variant,
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
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tsForm, setTsForm] = useState<TSFormType>(TsFormInitialState);
  const [file, setFile] = useState<File>({ name: "" } as File);

  const toggleModal = async () => {
    setIsOpen(!isOpen);
    if (!isEditMode) {
      await setTsForm({ ...TsFormInitialState, path: "" });
    }
  };

  //   Crear

  useEffect(() => {
    setFile({} as File);
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

  const handleSubmit = async (payload: TechnicalSheet) => {
    try {
      if (!isEditMode) {
        uploadFile(file, async (key) => {
          await addTechnicalSheet({ ...payload, path: key });
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTsForm(TsFormInitialState);
      setFile({} as File);
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
      console.log(technicalSheet);
      setFile({ name: technicalSheet.url });
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
        ts.title.toLowerCase().includes(searchFilter.toLocaleLowerCase())
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    {isEditMode ? "Editar Boletín" : "Agregar Boletín"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode ? "Editar Boletín" : "Agregar Boletín"}
                  </DialogDescription>
                </DialogHeader>
                <Label htmlFor="title">
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
                <Label htmlFor="description">
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
                <Label htmlFor="path">
                  <span className="text-redLabel">*</span> Documento
                </Label>
                {/* <Input
                  id="path"
                  name="path"
                  type="text"
                  placeholder="ej. Platinum"
                  value={tsForm.path}
                  onChange={handleForm}
                  required
                /> */}
                <MyDropzone
                  className={"p-8"}
                  file={file}
                  fileSetter={setFile}
                  type={"document"}
                />
                <Label htmlFor="logoImgUrl">Variante</Label>

                <DialogFooter>
                  <Button
                    disabled={!validateForm}
                    onClick={() => handleSubmit(tsForm)}
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
            <p>Loading...</p>
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
