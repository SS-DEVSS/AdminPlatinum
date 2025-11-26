import DetailsCard from "@/components/products/DetailsCard";
import ReferencesCard from "@/components/products/ReferencesCard";
import { detailsType } from "@/hooks/useFormProduct";
import { Reference } from "@/models/reference";

type DetailsInterface = {
  detailsState: detailsType;
  setDetailsState: React.Dispatch<React.SetStateAction<detailsType>>;
  referencesState: {
    references: Reference[];
  };
  setReferencesState: React.Dispatch<
    React.SetStateAction<{ references: Reference[] }>
  >;
};
const Details = ({
  detailsState,
  setDetailsState,
  referencesState,
  setReferencesState,
}: DetailsInterface) => {
  return (
    <section>
      <section className="flex flex-col md:flex-row justify-between gap-3 w-full">
        <DetailsCard state={detailsState} setState={setDetailsState} />

        <ReferencesCard state={referencesState} setState={setReferencesState} />
      </section>
    </section>
  );
};

export default Details;
