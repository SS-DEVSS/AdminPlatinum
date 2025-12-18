import { Category } from "@/models/category";
import { Reference } from "@/models/reference";
import { useState, useMemo } from "react";

export interface detailsType {
  id?: string | null;
  name: string;
  sku: string; // Added SKU
  brand: string; // Added Brand ID
  type: "SINGLE" | "KIT" | null;
  description: string;
  category: Pick<Category, "id" | "name"> | null;
  references: string[];
  imgUrl?: string;
}

export const stateSkeleton = {
  name: "",
  sku: "",
  brand: "",
  type: null,
  description: "",
  category: null,
  references: [],
  imgUrl: "",
};

export const useFormState = () => {
  const [detailsState, setDetailsState] = useState<detailsType>(stateSkeleton);
  const [attributesState, setAttributesState] = useState<any>({});
  const [referencesState, setReferencesState] = useState({
    references: [] as Reference[],
  });
  const [applicationsState, setApplicationsState] = useState({
    applications: [] as Reference[],
  });

  const [canContinue, setCanContinue] = useState(false);

  const isDetailsValid = useMemo(() => {
    return (
      detailsState.name && detailsState.description && detailsState.category
    );
  }, [detailsState]);

  const isReferencesValid = useMemo(() => {
    return referencesState.references.length > 0;
  }, [referencesState]);

  useMemo(() => {
    {
      isDetailsValid &&
        // referencesState.references.length > 0 && // Maybe not required for Step 1?
        setCanContinue(true);
    }
  }, [isDetailsValid, isReferencesValid]);

  return {
    detailsState,
    setDetailsState,
    attributesState,
    setAttributesState,
    referencesState,
    setReferencesState,
    applicationsState,
    setApplicationsState,
    canContinue,
    setCanContinue,
  };
};
