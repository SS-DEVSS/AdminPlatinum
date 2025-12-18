import DetailsCard from "@/components/products/DetailsCard";
import ReferencesCard from "@/components/products/ReferencesCard";
import ApplicationsCard from "@/components/products/ApplicationsCard";
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
  applicationsState: {
    applications: Reference[];
  };
  setApplicationsState: React.Dispatch<
    React.SetStateAction<{ applications: Reference[] }>
  >;
};
const Details = ({
  detailsState,
  setDetailsState,
  referencesState,
  setReferencesState,
  applicationsState,
  setApplicationsState,
}: DetailsInterface) => {
  return (
    <section className="flex flex-col gap-3 w-full">
      <DetailsCard state={detailsState} setState={setDetailsState} />
      <ReferencesCard state={referencesState} setState={setReferencesState} />
      <ApplicationsCard state={applicationsState} setState={setApplicationsState} />
    </section>
  );
};

export default Details;
