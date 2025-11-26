import { useState } from "react";
import { Product } from "@/models/product";
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
import { Note } from "@/models/note";
import { PlusCircle, Trash } from "lucide-react";

type NotesCardProps = {
  product?: Product | null;
};

const NotesCard = ({ product }: NotesCardProps) => {
  const [note, setNote] = useState<string>("");
  const [showInputNotes, setShowInputNotes] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState({
    notes: product ? product.notes : ([] as Note[]),
  });

  const handleAddClickNotes = () => {
    setShowInputNotes(!showInputNotes);
  };

  const handleAddNotes = () => {
    if (note !== null) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        note: note,
      };
      setFormInfo((prevForm) => ({
        ...prevForm,
        notes: [...prevForm.notes, newNote],
      }));
      setNote("");
      setShowInputNotes(false);
    }
  };

  const handleRemoveNotes = (id: string) => {
    setFormInfo((prevForm) => ({
      ...prevForm,
      notes: prevForm.notes.filter((note) => note.id !== id),
    }));
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Notas</CardTitle>
        <CardDescription>
          Agrega cualquier tipo de notas relevantes para los visitantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {formInfo.notes.length === 0 && showInputNotes === false ? (
          <NoData>
            <p className="text-[#94A3B8] font-medium">
              No hay números de referencia asociados
            </p>
          </NoData>
        ) : (
          <section className="flex gap-4 flex-wrap">
            {formInfo.notes.map((note, index) => (
              <div key={note.id} className="w-full">
                <Label>{`Nota ${index + 1}`}</Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input type="text" value={note.note} />
                  <Button
                    onClick={() => handleRemoveNotes(note.id as string)}
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}
        {showInputNotes && (
          <div className="flex gap-2 mt-4">
            <Input
              id="referencia"
              type="text"
              className="w-full"
              placeholder="Nota"
              value={note !== null ? note : ""}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button variant="outline" onClick={handleAddClickNotes}>
              Cancelar
            </Button>
            <Button onClick={handleAddNotes}>Agregar</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 hover:bg-slate-100 hover:text-black py-5"
          onClick={handleAddClickNotes}
          disabled={showInputNotes}
        >
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Agregar nota
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesCard;
