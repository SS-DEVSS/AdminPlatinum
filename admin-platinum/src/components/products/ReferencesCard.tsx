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

type ReferencesCardProps = {
  state: {
    references: Reference[];
  };
  setState: React.Dispatch<React.SetStateAction<{ references: Reference[] }>>;
  product?: Product | null;
};

const ReferencesCard = ({ state, setState, product }: ReferencesCardProps) => {
  const [showInput, setShowInput] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [referenceBrand, setReferenceBrand] = useState<string>("");
  const [referenceDescription, setReferenceDescription] = useState<string>("");

  // Load references from product when editing (using useEffect to avoid render issues)
  useEffect(() => {
    if (product && product.references) {
      setState({
        references: product.references,
      });
    }
  }, [product, setState]);

  const handleAddClick = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const handleAddReference = () => {
    if (referenceNumber && referenceBrand) {
      const newReference: Reference = {
        id: crypto.randomUUID(),
        sku: "", // SKU will be linked to product on save
        referenceBrand: referenceBrand,
        referenceNumber: referenceNumber,
        typeOfPart: null,
        type: "Aftermarket", // Default
        description: referenceDescription || null,
      };
      setState((prevForm) => ({
        ...prevForm,
        references: [...prevForm.references, newReference],
      }));
      setReferenceNumber("");
      setReferenceBrand("");
      setReferenceDescription("");
      setShowInput(false);
    }
  };

  const handleRemoveReference = (id: string) => {
    setState((prevForm) => ({
      ...prevForm,
      references: prevForm.references.filter((ref) => ref.id !== id),
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Referencias</CardTitle>
        <CardDescription>
          Ingrese los números de referencia asociados al producto.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {state.references.length === 0 && showInput === false ? (
          <NoData>
            <p className="text-[#94A3B8] font-medium">
              No hay números de referencia asociados
            </p>
          </NoData>
        ) : (
          <section className="flex gap-4 flex-wrap">
            {state.references.map((reference) => (
              <div
                key={reference.id}
                className="bg-black rounded-full text-white p-2 mb-2 flex gap-3 px-6 items-center"
              >
                <span>
                  {reference.referenceBrand && <span className="font-bold mr-1">{reference.referenceBrand}:</span>}
                  {reference.referenceNumber}
                </span>
                <X
                  onClick={() => handleRemoveReference(reference.id)}
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
                value={referenceBrand}
                onChange={(e) => setReferenceBrand(e.target.value)}
              />
              <Input
                type="text"
                className="w-2/3"
                placeholder="Número de referencia"
                value={referenceNumber || ""}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
            <Input
              type="text"
              className="w-full"
              placeholder="Descripción (Opcional)"
              value={referenceDescription}
              onChange={(e) => setReferenceDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleAddClick}>
                Cancelar
              </Button>
              <Button onClick={handleAddReference} disabled={!referenceNumber || !referenceBrand}>Agregar</Button>
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
          Agregar número de Referencia
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferencesCard;
