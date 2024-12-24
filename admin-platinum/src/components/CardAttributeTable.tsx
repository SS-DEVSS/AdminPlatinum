import { AlertTriangle, MoreVertical, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryAtributes } from "@/models/category";
import NoData from "./NoData";

interface CardAttributeTableProps {
  title: string;
  attributes: CategoryAtributes[];
  handleEditClick: (attribute: CategoryAtributes) => void;
}

const CardAttributeTable = ({
  title,
  attributes,
  handleEditClick,
}: CardAttributeTableProps) => {
  return (
    <>
      {attributes.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo de Dato</TableHead>
              <TableHead>Obligatorio</TableHead>
              <TableHead className="w-[20px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute: CategoryAtributes) => (
              <TableRow key={attribute.name}>
                <TableCell className="font-semibold">
                  {attribute.name}
                </TableCell>
                <TableCell>{attribute.type}</TableCell>
                <TableCell>
                  <Badge>{attribute.required ? "Si" : "No"}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(attribute)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>
                            Editar{" "}
                            {title === "Atributos de Categoría"
                              ? "Atributo"
                              : "Variante"}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>
                            Eliminar{" "}
                            {title === "Atributos de Categoría"
                              ? "Atributo"
                              : "Variante"}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <NoData>
          <AlertTriangle className="text-[#4E5154]" />
          <p className="text-[#4E5154]">
            {title === "Atributos de Categoría"
              ? "No existen atributos asociados"
              : "No existen variantes asociadas"}
          </p>
          <p className="text-[#94A3B8] font-semibold text-sm">
            Agrega uno en la parte posterior
          </p>
        </NoData>
      )}
    </>
  );
};

export default CardAttributeTable;
