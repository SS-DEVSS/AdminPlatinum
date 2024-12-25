import CardSectionLayout from "@/components/Layouts/CardSectionLayout";
import Layout from "@/components/Layouts/Layout";
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
import { useTs } from "@/hooks/useTs";
import { Variant } from "@/models/item";
import { TechnicalSheet } from "@/models/technicalSheet";
import { PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface TSFormType {
  title: string;
  path: string;
  description: string;
  variant?: Variant | null;
}

const TsFormInitialState = {
  title: "",
  path: "",
  description: "",
  variant: {} as Variant,
};

const TechincalSheets = () => {
  const { technicalSheets, addTechnicalSheet, deleteTechnicalSheet } = useTs();

  const [searchFilter, setSearchFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tsForm, setTsForm] = useState<TSFormType>(TsFormInitialState);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  //   Crear

  const validateForm = useMemo(
    () =>
      tsForm.title.trim() !== "" &&
      tsForm.description.trim() !== "" &&
      tsForm.path.includes("https://") &&
      tsForm.path.includes(".pdf"),
    [tsForm]
  );

  const handleSubmit = async (payload: TechnicalSheet) => {
    try {
      await addTechnicalSheet(payload);
      toggleModal();
      setTsForm(TsFormInitialState);
    } catch (error) {
      console.log(error);
    }
  };

  const handleForm = (e: any) => {
    const { name, value } = e.target;
    setTsForm({
      ...tsForm,
      [name]: value,
    });
  };

  console.log(searchFilter);

  //   Read

  const handleSearchFilter = (e: any) => {
    const { value } = e.target;
    setSearchFilter(value);
  };

  const filteredTs = useMemo(
    () =>
      technicalSheets.filter((ts: TechnicalSheet) =>
        ts.title.toLocaleLowerCase().includes(searchFilter.toLowerCase())
      ),
    [searchFilter]
  );

  console.log(filteredTs);

  return (
    <Layout>
      <Card className="border-0 shadow-none">
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
              onOpenChange={(open) => {
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
                  required
                />
                <Label htmlFor="path">
                  <span className="text-redLabel">*</span> Documento
                </Label>
                <Input
                  id="path"
                  name="path"
                  type="text"
                  placeholder="ej. Platinum"
                  value={tsForm.path}
                  onChange={handleForm}
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
                  required
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
        <CardContent className="p-0">
          <CardSectionLayout>
            {technicalSheets.length === 0 && filteredTs.length === 0 ? (
              <p>No hay marcas disponibles.</p>
            ) : (
              (filteredTs.length > 0 ? filteredTs : technicalSheets).map(
                (ts: TechnicalSheet) => (
                  <TsCard
                    key={ts.id}
                    ts={ts}
                    deleteTechnicalSheet={deleteTechnicalSheet}
                  />
                )
              )
            )}
          </CardSectionLayout>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TechincalSheets;
