import { TechnicalSheet } from "@/models/technicalSheet";

import { useDeleteModal } from "@/context/delete-context";

import { MoreVertical, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TsCardProps = {
  ts: TechnicalSheet;
  deleteTechnicalSheet: (id: TechnicalSheet["id"]) => void;
};

const TsCard = ({ ts, deleteTechnicalSheet }: TsCardProps) => {
  const { openModal } = useDeleteModal();

  const handleDeleteTS = async () => {
    await deleteTechnicalSheet(ts.id);
  };

  return (
    <div className="border shadow bg-secondary w-full flex gap-4 rounded-2xl p-3">
      {/* <img src={ts.url} alt={`imagen ${ts.title}`} /> */}
      <div className="h-40 basis-1/3 rounded-xl bg-black">.</div>
      <section className="basis-2/3 text-black">
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl">{ts.title}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                // onClick={() => handleEditCategory(category?.id)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Editar Boletín</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    openModal({
                      title: "Categoría",
                      description: "Estas seguro que deseas eliminar esta?",
                      handleDelete: handleDeleteTS,
                    })
                  }
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Eliminar Boletín</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-2">{ts.description}</p>
      </section>
    </div>
  );
};

export default TsCard;
