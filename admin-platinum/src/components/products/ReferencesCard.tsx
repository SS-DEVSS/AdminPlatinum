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

type ReferencesCardProps = {
  state: {
    references: Reference[];
  };
  setState: React.Dispatch<React.SetStateAction<{ references: Reference[] }>>;
  product?: Product | null;
};

const ReferencesCard = ({ state, setState, product }: ReferencesCardProps) => {
  const [showInput, setShowInput] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<number | null>(null);
  // const [form, setForm] = useState({
  //   references: product ? product.references : ([] as Reference[]),
  // });

  if (product) {
    setState({
      references: product.references,
    });
  }

  const handleAddClick = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const handleAddReference = () => {
    if (referenceNumber !== null) {
      const newReference: Reference = {
        id: crypto.randomUUID(),
        value: referenceNumber,
      };
      setState((prevForm) => ({
        ...prevForm,
        references: [...prevForm.references, newReference],
      }));
      setReferenceNumber(null);
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
                className="bg-black rounded-full text-white p-2 mb-2 flex gap-3 px-6"
              >
                {reference.value}
                <X
                  onClick={() => handleRemoveReference(reference.id)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </section>
        )}
        {showInput && (
          <div className="flex gap-2 mt-4">
            <Input
              id="referencia"
              type="number"
              className="w-full"
              placeholder="Número de referencia"
              value={referenceNumber !== null ? referenceNumber : ""}
              onChange={(e) => setReferenceNumber(Number(e.target.value))}
            />
            <Button variant="outline" onClick={handleAddClick}>
              Cancelar
            </Button>
            <Button onClick={handleAddReference}>Agregar</Button>
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
