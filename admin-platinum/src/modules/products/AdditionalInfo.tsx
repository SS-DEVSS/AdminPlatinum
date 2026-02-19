import DocumentsCard from "@/components/products/DocumentsCard";
import { useEffect } from "react";
import { Document as DocumentType } from "@/models/technicalSheet";

type AdditionalInfoInterface = {
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  product?: any | null;
  onDocumentsChange?: (documents: DocumentType[]) => void;
};

const AdditionalInfo = ({ setCanContinue, product, onDocumentsChange }: AdditionalInfoInterface) => {
  useEffect(() => {
    setCanContinue(true);
  }, []);

  return (
    <section className="flex flex-col md:flex-row justify-between gap-3 w-full">
      <DocumentsCard product={product} onDocumentsChange={onDocumentsChange} />
    </section>
  );
};

export default AdditionalInfo;
