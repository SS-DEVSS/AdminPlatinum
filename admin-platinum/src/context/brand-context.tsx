import { createContext, useState, useContext } from "react";

type ModalState = {
  isOpen: boolean;
};

const BrandContext = createContext<{
  modalState: ModalState;
  openModal: (state: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
}>({} as any);

export const useBrandModal = () => useContext(BrandContext);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
  });

  const openModal = () => {
    setModalState({ isOpen: true });
  };

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  return (
    <BrandContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </BrandContext.Provider>
  );
};
