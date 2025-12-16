import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/models/product";
import { Document as DocumentType } from "@/models/technicalSheet";
import { PlusCircle, Trash } from "lucide-react";
import { useState } from "react";

type DocumentsCardProps = {
  product?: Product | null;
};

const DocumentsCard = ({ product }: DocumentsCardProps) => {
  const [document, setDocument] = useState<string>("");
  const [showInputDocuments, setShowInputDocuments] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState<{ documents: DocumentType[] }>({
    documents: product?.documents ? (product.documents as unknown as DocumentType[]) : ([] as DocumentType[]),
  });

  const handleAddClickDocuments = () => {
    setShowInputDocuments(!showInputDocuments);
  };

  const handleAddDocuments = () => {
    if (document !== null) {
      const newDocument: DocumentType = {
        id: crypto.randomUUID(),
        title: document,
      };
      setFormInfo((prevForm) => ({
        ...prevForm,
        documents: [...prevForm.documents, newDocument],
      }));
      setDocument("");
      setShowInputDocuments(false);
    }
  };

  const handleRemoveDocuments = (id: string) => {
    setFormInfo((prevForm) => ({
      ...prevForm,
      documents: prevForm.documents.filter((doc) => doc.id !== id),
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>
          Ingrese documentos relevantes para el producto.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {formInfo.documents.length === 0 && showInputDocuments === false ? (
          <NoData>
            <p className="text-[#94A3B8] font-medium">
              No hay números de referencia asociados
            </p>
          </NoData>
        ) : (
          <section className="flex gap-4 flex-wrap">
            {formInfo.documents.map((document, index) => (
              <div key={document.id} className="w-full">
                <Label>{`Documento ${index + 1}`}</Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input type="text" value={document.title} />
                  <Button
                    onClick={() => handleRemoveDocuments(document.id)}
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}
        {showInputDocuments && (
          <div className="flex gap-2 mt-4">
            <Input
              id="referencia"
              type="file"
              className="w-full"
              placeholder="Nota"
              value={document !== null ? document : ""}
              onChange={(e) => setDocument(e.target.value)}
            />
            <Button variant="outline" onClick={handleAddClickDocuments}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocuments}>Agregar</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 hover:bg-slate-100 hover:text-black py-5"
          onClick={handleAddClickDocuments}
          disabled={showInputDocuments}
        >
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Agregar Documento
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentsCard;
