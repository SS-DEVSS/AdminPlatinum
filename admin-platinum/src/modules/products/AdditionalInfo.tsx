// import DocumentsCard from "@/components/products/DocumentsCard";
// import NotesCard from "@/components/products/NotesCard";
import { useEffect } from "react";
import { Note } from "@/models/note";
import { Document as DocumentType } from "@/models/technicalSheet";

type AdditionalInfoInterface = {
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  product?: any | null;
  onNotesChange?: (notes: Note[]) => void;
  onDocumentsChange?: (documents: DocumentType[]) => void;
};

const AdditionalInfo = ({ setCanContinue, product: _product, onNotesChange: _onNotesChange, onDocumentsChange: _onDocumentsChange }: AdditionalInfoInterface) => {
  useEffect(() => {
    setCanContinue(true);
  }, []);

  return (
    <section className="flex flex-col md:flex-row justify-between gap-3 w-full">
      {/* Secciones Notas y Documentos temporalmente ocultas
      <NotesCard product={product} onNotesChange={onNotesChange} />
      <DocumentsCard product={product} onDocumentsChange={onDocumentsChange} />
      */}
    </section>
  );
};

export default AdditionalInfo;
