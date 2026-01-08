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
import { CategoryAtributes, CategoryAttributesTypes } from "@/models/category";
import NoData from "./NoData";

// Mapeo de tipos técnicos a nombres amigables para el usuario
const typeDisplayNames: Record<string, string> = {
  [CategoryAttributesTypes.STRING]: "Texto",
  [CategoryAttributesTypes.NUMERIC]: "Número",
  [CategoryAttributesTypes.DATE]: "Fecha",
  [CategoryAttributesTypes.BOOLEAN]: "Verdadero/Falso",
  // También manejar valores en mayúsculas que pueden venir del backend
  "STRING": "Texto",
  "NUMBER": "Número",
  "NUMERIC": "Número",
  "DATE": "Fecha",
  "BOOLEAN": "Verdadero/Falso",
  "string": "Texto",
  "number": "Número",
  "numeric": "Número",
  "date": "Fecha",
  "boolean": "Verdadero/Falso",
};

// Función helper para obtener el nombre traducido del tipo
const getTypeDisplayName = (type: string): string => {
  const normalizedType = type?.toLowerCase() || "";
  return typeDisplayNames[type] ||
    typeDisplayNames[normalizedType] ||
    typeDisplayNames[type.toUpperCase()] ||
    type;
};

interface CardAttributeTableProps {
  title: string;
  attributes: CategoryAtributes[];
  handleEditClick: (attribute: CategoryAtributes) => void;
  handleDeleteClick: (name: string) => void;
}

const CardAttributeTable = ({
  title,
  attributes,
  handleEditClick,
  handleDeleteClick,
}: CardAttributeTableProps) => {
  return (
    <>
      {attributes.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo de Dato</TableHead>
              <TableHead>Opcional</TableHead>
              <TableHead className="w-[20px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute: CategoryAtributes) => (
              <TableRow key={attribute.name}>
                <TableCell className="font-semibold">
                  {attribute.name}
                </TableCell>
                <TableCell>
                  {getTypeDisplayName(attribute.type)}
                </TableCell>
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
                          <span>Editar Atributo</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(attribute.name)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Eliminar Atributo</span>
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
            No existen atributos asociados
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
