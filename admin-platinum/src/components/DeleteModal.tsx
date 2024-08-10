import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeleteModal } from "@/context/delete-context";

const DeleteModal = () => {
  const { modalState, closeModal } = useDeleteModal();
  const { isOpen, title, description, handleDelete } = modalState;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">Eliminar {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Esta acción es irreversible</AlertTitle>
        </Alert>
        <DialogFooter>
          <Button onClick={closeModal} variant="outline">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleDelete();
              closeModal();
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
