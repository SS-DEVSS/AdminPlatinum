import { useState } from "react";
import NoData from "@/components/NoData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category, CategoryAtributes, typesArray } from "@/models/category";
import {
  AlertTriangle,
  MoreVertical,
  Pencil,
  PlusCircle,
  Trash,
} from "lucide-react";

type CardAtributesVariantsProps = {
  category?: Category;
  title: "Atributos de Categoría" | "Atributos de Variantes";
  description: string;
};

const CardAtributesVariants = ({
  category,
  title,
  description,
}: CardAtributesVariantsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentAttribute, setCurrentAttribute] =
    useState<CategoryAtributes | null>(null);

  const handleEditClick = (attribute: CategoryAtributes) => {
    setCurrentAttribute(attribute);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAttribute(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    setIsDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {category?.attributes ? (
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
              {category.attributes.map((attribute) => (
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
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={handleAddClick}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {title === "Atributos de Categoría"
                ? "Agregar Atributos de Categoría"
                : "Agregar Atributos de Variantes"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-2">
                {dialogMode === "edit"
                  ? title === "Atributos de Categoría"
                    ? "Editar Atributo"
                    : "Editar Variante"
                  : title === "Atributos de Categoría"
                  ? "Agregar Atributo"
                  : "Agregar Variante"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "edit"
                  ? title === "Atributos de Categoría"
                    ? "Editar un atributo existente."
                    : "Editar una variante existente."
                  : title === "Atributos de Categoría"
                  ? "Agregar un nuevo atributo al sistema."
                  : "Agregar una nueva variante al sistema."}
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="name">
              <span className="text-redLabel">*</span>Nombre
            </Label>
            <Input
              id="name"
              type="name"
              placeholder="ej. Platinum"
              defaultValue={currentAttribute?.name || ""}
              required
            />
            <Label htmlFor="data-type">
              <span className="text-redLabel">*</span>Tipo de Dato
            </Label>
            <Select defaultValue={currentAttribute?.type || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tipo de dato" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de Datos</SelectLabel>
                  {typesArray.map((type) => (
                    <SelectItem value={type}>{type}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label>
              <span className="text-redLabel">*</span>Opcional?
            </Label>
            <RadioGroup defaultValue={currentAttribute?.required ? "si" : "no"}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="r1" />
                <Label htmlFor="r1">Si</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>
            <DialogFooter>
              <Button type="submit" onSubmit={() => handleSubmit}>
                {dialogMode === "edit"
                  ? title === "Atributos de Categoría"
                    ? "Guardar Cambios"
                    : "Guardar Cambios"
                  : title === "Atributos de Categoría"
                  ? "Agregar Atributo"
                  : "Agregar Variante"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CardAtributesVariants;
