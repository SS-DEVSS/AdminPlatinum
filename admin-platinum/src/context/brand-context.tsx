import { Brand } from "@/models/brand";
import { createContext, useState, useContext, Dispatch } from "react";

type ModalState = {
  isOpen: boolean;
  title: string;
  description: string;
  action: any;
};

const BrandContext = createContext<{
  selectedBrand: Brand["id"] | null;
  setSelectedBrand: Dispatch<Brand["id"] | null>;
  modalState: ModalState;
  openModal: (state: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
}>({} as any);

export const useBrandContext = () => useContext(BrandContext);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand["id"] | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
  });

  const openModal = ({
    title,
    description,
    action,
  }: Omit<ModalState, "isOpen">) => {
    setModalState({ isOpen: true, title, description, action });
  };

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  return (
    <BrandContext.Provider
      value={{
        selectedBrand,
        setSelectedBrand,
        modalState,
        openModal,
        closeModal,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
