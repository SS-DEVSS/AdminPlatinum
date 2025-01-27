import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hooks/useFormProduct";
import AdditionalInfo from "@/modules/products/AdditionalInfo";
import Attributes from "@/modules/products/Attributes";
import Details from "@/modules/products/Details";
import Variants from "@/modules/products/Variants";
import { ChevronLeft, Circle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const NewProduct = () => {
  const {
    detailsState,
    setDetailsState,
    referencesState,
    setReferencesState,
    canContinue,
    setCanContinue,
  } = useFormState();

  const [module, setModule] = useState<number>(0);

  const steps = [
    "Detalles de Producto",
    "Attributos de la Categoría",
    "Variantes del Producto",
    "Información y documentos adicionales",
  ];

  const getPage = (module: number) => {
    switch (module) {
      case 0:
        return (
          <Details
            detailsState={detailsState}
            setDetailsState={setDetailsState}
            referencesState={referencesState}
            setReferencesState={setReferencesState}
          />
        );
      case 1:
        return <Attributes setCanContinue={setCanContinue} />;
      case 2:
        return <Variants />;
      case 3:
        return <AdditionalInfo setCanContinue={setCanContinue} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/categorias">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            Nuevo Producto
          </p>
        </div>
      </header>
      <section className="flex justify-center mt-6 gap-3">
        {steps.map((step, index) => (
          <>
            <div className="flex flex-col items-center gap-3">
              <Circle
                fill={module < index ? "#D9D9D9" : "black"}
                className={module < index ? "text-[#D9D9D9]" : "text-black"}
              />
              <p className={module === index ? "font-bold" : ""}>{step}</p>
            </div>
            {index <= steps.length - 2 && (
              <Separator
                className={`w-44 h-2 rounded-3xl mt-3 ${
                  index < module ? "bg-black" : "bg-[#D9D9D9]"
                }`}
              />
            )}
          </>
        ))}
      </section>
      <section className="flex flex-col justify-center gap-4 mt-2">
        {getPage(module)}
        <section className="flex justify-center gap-3">
          {module != 0 && (
            <Button
              onClick={() => setModule((prev) => prev - 1)}
              className="w-28"
              variant="outline"
            >
              Anterior
            </Button>
          )}
          {module != 3 ? (
            <Button
              disabled={!canContinue}
              onClick={() => setModule((prev) => prev + 1)}
              className="w-28"
            >
              Siguiente
            </Button>
          ) : (
            <Button className="w-28">Publicar</Button>
          )}
        </section>
      </section>
    </Layout>
  );
};

export default NewProduct;
