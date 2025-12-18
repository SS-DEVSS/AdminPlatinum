import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Product } from "@/models/product";
import { Reference } from "@/models/reference";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import NoData from "../NoData";
import { Button } from "../ui/button";

type ApplicationsCardProps = {
  state: {
    applications: Reference[];
  };
  setState: React.Dispatch<React.SetStateAction<{ applications: Reference[] }>>;
  product?: Product | null;
};

const ApplicationsCard = ({ state, setState, product }: ApplicationsCardProps) => {
  const [showInput, setShowInput] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [applicationBrand, setApplicationBrand] = useState<string>("");
  const [applicationDescription, setApplicationDescription] = useState<string>("");

  if (product) {
    // If editing, load applications from product if available
    // For now, applications will be similar to references structure
  }

  const handleAddClick = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const handleAddApplication = () => {
    if (applicationNumber && applicationBrand) {
      const newApplication: Reference = {
        id: crypto.randomUUID(),
        sku: "",
        referenceBrand: applicationBrand,
        referenceNumber: applicationNumber,
        typeOfPart: null,
        type: "Application",
        description: applicationDescription || null,
      };
      setState((prevForm) => ({
        ...prevForm,
        applications: [...prevForm.applications, newApplication],
      }));
      setApplicationNumber("");
      setApplicationBrand("");
      setApplicationDescription("");
      setShowInput(false);
    }
  };

  const handleRemoveApplication = (id: string) => {
    setState((prevForm) => ({
      ...prevForm,
      applications: prevForm.applications.filter((app) => app.id !== id),
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Aplicaciones</CardTitle>
        <CardDescription>
          Ingrese las aplicaciones asociadas al producto.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {state.applications.length === 0 && showInput === false ? (
          <NoData>
            <p className="text-[#94A3B8] font-medium">
              No hay aplicaciones asociadas
            </p>
          </NoData>
        ) : (
          <section className="flex gap-4 flex-wrap">
            {state.applications.map((application) => (
              <div
                key={application.id}
                className="bg-black rounded-full text-white p-2 mb-2 flex gap-3 px-6 items-center"
              >
                <span>
                  {application.referenceBrand && <span className="font-bold mr-1">{application.referenceBrand}:</span>}
                  {application.referenceNumber}
                </span>
                <X
                  onClick={() => handleRemoveApplication(application.id)}
                  className="cursor-pointer w-4 h-4"
                />
              </div>
            ))}
          </section>
        )}
        {showInput && (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                className="w-1/3"
                placeholder="Marca (Ej. LUK)"
                value={applicationBrand}
                onChange={(e) => setApplicationBrand(e.target.value)}
              />
              <Input
                type="text"
                className="w-2/3"
                placeholder="Número de aplicación"
                value={applicationNumber || ""}
                onChange={(e) => setApplicationNumber(e.target.value)}
              />
            </div>
            <Input
              type="text"
              className="w-full"
              placeholder="Descripción (Opcional)"
              value={applicationDescription}
              onChange={(e) => setApplicationDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleAddClick}>
                Cancelar
              </Button>
              <Button onClick={handleAddApplication} disabled={!applicationNumber || !applicationBrand}>Agregar</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 hover:bg-slate-100 hover:text-black py-5"
          onClick={handleAddClick}
          disabled={showInput}
        >
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Agregar Aplicación
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationsCard;

