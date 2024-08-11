import { createContext, useState, useContext } from "react";

type ModalState = {
  isOpen: boolean;
  title: string;
  description: string;
  pathname?: string;
  handleDelete: () => void;
};

const DeleteContext = createContext<{
  modalState: ModalState;
  openModal: (state: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
}>({} as any);

export const useDeleteModal = () => useContext(DeleteContext);

export const DeleteModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
    handleDelete: () => {},
  });

  const openModal = ({
    title,
    description,
    handleDelete,
    pathname,
  }: Omit<ModalState, "isOpen">) => {
    setModalState({ isOpen: true, title, description, pathname, handleDelete });
  };

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  return (
    <DeleteContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </DeleteContext.Provider>
  );
};
