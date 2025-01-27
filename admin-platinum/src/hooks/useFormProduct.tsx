import { Category } from "@/models/category";
import { Reference } from "@/models/reference";
import { useState, useMemo } from "react";

export interface detailsType {
  id?: string | null;
  name: string;
  type: "SINGLE" | "KIT" | null;
  description: string;
  category: Pick<Category, "id" | "name"> | null;
  references: string[];
}

export const stateSkeleton = {
  name: "",
  type: null,
  description: "",
  category: null,
  references: [],
};

export const useFormState = () => {
  const [detailsState, setDetailsState] = useState<detailsType>(stateSkeleton);
  const [referencesState, setReferencesState] = useState({
    references: [] as Reference[],
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
        referencesState.references.length > 0 &&
        setCanContinue(true);
    }
  }, [isDetailsValid, isReferencesValid]);

  return {
    detailsState,
    setDetailsState,
    referencesState,
    setReferencesState,
    canContinue,
    setCanContinue,
  };
};
