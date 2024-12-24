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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTs } from "@/hooks/useTs";
import { TechnicalSheet } from "@/models/technicalSheet";
import { PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

const TechincalSheets = () => {
  const { technicalSheets } = useTs();

  const [searchFilter, setSearchFilter] = useState("");

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
            // open={isOpen}
            // onOpenChange={(open) => {
            //   if (!open) {
            //     setForm({
            //       name: "",
            //       description: "",
            //       logoImgUrl: "",
            //     });
            //     setIsEditMode(false);
            //     closeModal();
            //   }
            // }}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-10 px-6 gap-1"
                  // onClick={() => handleOpenModal()}
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Boletín
                  </span>
                </Button>
              </DialogTrigger>
              {/* <DialogContent className="sm:max-w-[425px]">
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
                  <Label htmlFor="logoImgUrl">Imagen</Label>
                  <Input
                    id="logoImgUrl"
                    name="logoImgUrl"
                    type="text"
                    placeholder="https://"
                    value={form.logoImgUrl}
                    onChange={handleForm}
                    required
                  />
                  <DialogDescription>
                    Formatos Válidos: jpg, png, jpeg
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      disabled={!validateForm()}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      {isEditMode ? "Actualizar Marca" : "Agregar Marca"}
                    </Button>
                  </DialogFooter>
                </DialogContent> */}
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CardSectionLayout>
            {filteredTs.length === 0 && technicalSheets.length ? (
              <>no hay nada</>
            ) : (
              (filteredTs.length > 0 ? filteredTs : technicalSheets).map(
                (ts: TechnicalSheet) => <TsCard key={ts.id} ts={ts} />
              )
            )}
          </CardSectionLayout>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TechincalSheets;
