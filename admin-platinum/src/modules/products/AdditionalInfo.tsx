import DocumentsCard from "@/components/products/DocumentsCard";
import NotesCard from "@/components/products/NotesCard";
import { useEffect } from "react";

type AdditionalInfoInterface = {
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdditionalInfo = ({ setCanContinue }: AdditionalInfoInterface) => {
  useEffect(() => {
    setCanContinue(true);
  }, []);

  return (
    <section className="flex flex-col md:flex-row justify-between gap-3 w-full">
      <NotesCard />
      <DocumentsCard />
    </section>
  );
};

export default AdditionalInfo;
