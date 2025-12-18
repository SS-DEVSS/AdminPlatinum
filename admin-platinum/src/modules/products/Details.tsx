import DetailsCard from "@/components/products/DetailsCard";
import ReferencesCard from "@/components/products/ReferencesCard";
import ApplicationsCard from "@/components/products/ApplicationsCard";
import { detailsType } from "@/hooks/useFormProduct";
import { Reference } from "@/models/reference";

import { Product } from "@/models/product";

type DetailsInterface = {
  detailsState: detailsType;
  setDetailsState: React.Dispatch<React.SetStateAction<detailsType>>;
  referencesState: {
    references: Reference[];
  };
  setReferencesState: React.Dispatch<
    React.SetStateAction<{ references: Reference[] }>
  >;
  applicationsState: {
    applications: Reference[];
  };
  setApplicationsState: React.Dispatch<
    React.SetStateAction<{ applications: Reference[] }>
  >;
  product?: Product | null;
};
const Details = ({
  detailsState,
  setDetailsState,
  referencesState,
  setReferencesState,
  applicationsState,
  setApplicationsState,
  product,
}: DetailsInterface) => {
  return (
    <section className="flex flex-col gap-3 w-full">
      <DetailsCard state={detailsState} setState={setDetailsState} />
      <ReferencesCard state={referencesState} setState={setReferencesState} product={product} />
      <ApplicationsCard state={applicationsState} setState={setApplicationsState} product={product} />
    </section>
  );
};

export default Details;
