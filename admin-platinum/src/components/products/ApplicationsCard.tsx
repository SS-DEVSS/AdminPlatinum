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
import { useState, useEffect } from "react";
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

  // Load applications from product when editing (using useEffect to avoid render issues)
  useEffect(() => {
    if (product && product.applications) {
      // Applications are already formatted in newProduct.tsx
      setState({
        applications: product.applications,
      });
    }
  }, [product, setState]);

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
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Cada aplicación muestra información del vehículo (Modelo, Submodelo, Año, etc.) seguida de un identificador único entre paréntesis. 
            Este identificador corresponde a los últimos 8 caracteres del ID de la aplicación en la base de datos, lo que permite diferenciar cada aplicación y facilitar su búsqueda o referencia si es necesario.
            Si aparece "BASE" o "Aplicación", significa que esa aplicación no tiene información adicional de vehículo, pero el identificador único permite diferenciarla de las demás.
          </p>
        </div>
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
            {state.applications.map((application: any) => {
              // Use displayText if available (from formatted applications), otherwise build from referenceBrand/referenceNumber
              // NEVER use application.sku as it's the same for all applications
              const displayText = application.displayText || 
                (application.referenceBrand && application.referenceNumber
                  ? `${application.referenceBrand}: ${application.referenceNumber}`
                  : application.referenceNumber || 
                    application.referenceBrand || 
                    application.description ||
                    `Aplicación (${application.id ? application.id.substring(application.id.length - 8).toUpperCase() : 'N/A'})` ||
                    "Sin información");
              
              return (
                <div
                  key={application.id}
                  className="bg-black rounded-full text-white py-3 px-6 mb-2 flex gap-3 items-center min-h-[40px] shadow-md hover:bg-gray-800 transition-colors"
                  title={application.description || displayText}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {displayText}
                  </span>
                  <X
                    onClick={() => handleRemoveApplication(application.id)}
                    className="cursor-pointer w-4 h-4 hover:text-red-300 transition-colors flex-shrink-0"
                  />
                </div>
              );
            })}
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

