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
  onNotesChange?: (notes: Note[]) => void;
};

const NotesCard = ({ product, onNotesChange }: NotesCardProps) => {
  const [note, setNote] = useState<string>("");
  const [showInputNotes, setShowInputNotes] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState({
    notes: product?.notes ? (product.notes as Note[]) : ([] as Note[]),
  });

  // Notify parent when notes change
  const updateNotes = (newNotes: Note[]) => {
    setFormInfo({ notes: newNotes });
    onNotesChange?.(newNotes);
  };

  const handleAddClickNotes = () => {
    setShowInputNotes(!showInputNotes);
  };

  const handleAddNotes = () => {
    if (note !== null && note.trim() !== "") {
      const newNote: Note = {
        id: crypto.randomUUID(),
        note: note,
      };
      const updatedNotes = [...formInfo.notes, newNote];
      updateNotes(updatedNotes);
      setNote("");
      setShowInputNotes(false);
    }
  };

  const handleRemoveNotes = (id: string) => {
    const updatedNotes = formInfo.notes.filter((note) => note.id !== id);
    updateNotes(updatedNotes);
  };

  return (
    <Card className="w-full flex flex-col mt-5 opacity-60">
      <CardHeader>
        <CardTitle>Notas</CardTitle>
        <CardDescription>
          Agrega cualquier tipo de notas relevantes para los visitantes.
          <span className="block mt-1 text-xs text-muted-foreground italic">
            (Funcionalidad temporalmente deshabilitada)
          </span>
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
                  <Input 
                    type="text" 
                    value={note.note} 
                    disabled
                    onChange={(e) => {
                      const updatedNotes = formInfo.notes.map((n) =>
                        n.id === note.id ? { ...n, note: e.target.value } : n
                      );
                      updateNotes(updatedNotes);
                    }}
                  />
                  <Button
                    onClick={() => handleRemoveNotes(note.id as string)}
                    size="icon"
                    disabled
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
              disabled
            />
            <Button variant="outline" onClick={handleAddClickNotes} disabled>
              Cancelar
            </Button>
            <Button onClick={handleAddNotes} disabled>Agregar</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 hover:bg-slate-100 hover:text-black py-5"
          onClick={handleAddClickNotes}
          disabled
        >
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Agregar nota
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesCard;
