import { useState } from "react";
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
  CategoryAtributes,
  CategoryAttributesTypes,
  typesArray,
} from "@/models/category";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useMemo } from "react";
import { Dispatch } from "react";
import { formTypes } from "./CatgegoryCU";
import CardAttributeTable from "@/components/CardAttributeTable";

type CardAtributesVariantsProps = {
  form: formTypes;
  setForm: Dispatch<React.SetStateAction<formTypes>>;
  title: "Atributos de Categoría" | "Atributos de Variantes";
  description: string;
};

interface AttributeFormType {
  name: string;
  type: CategoryAttributesTypes | string;
  required: boolean;
}

const AttributeFormInitialState = {
  name: "",
  type: "",
  required: false,
};

interface AttributesType {
  productAttributes: CategoryAtributes[];
  variantAttributes: CategoryAtributes[];
}

const CardAtributesVariants = ({
  form,
  setForm,
  title,
  description,
}: CardAtributesVariantsProps) => {
  const [type, setType] = useState<"VARIANT" | "PRODUCT" | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentAttribute, setCurrentAttribute] =
    useState<CategoryAtributes | null>(null);
  const [attributeForm, setAttributeForm] = useState<AttributeFormType>(
    AttributeFormInitialState
  );
  const [attributes, setAttributes] = useState<AttributesType>({
    productAttributes: [],
    variantAttributes: [],
  });

  useEffect(() => {
    if (title === "Atributos de Categoría") {
      setType("PRODUCT");
    } else {
      setType("VARIANT");
    }
  }, []);

  useEffect(() => {
    if (form.attributes) {
      const productAttrs = form.attributes.filter(
        (attr) => attr.scope === "PRODUCT"
      );
      const variantAttrs = form.attributes.filter(
        (attr) => attr.scope === "VARIANT"
      );
      setAttributes({
        productAttributes: productAttrs,
        variantAttributes: variantAttrs,
      });
    }
  }, [form.attributes]);

  const handleAttributeForm = (e: any) => {
    const { name, value } = e.target;
    setAttributeForm({
      ...attributeForm,
      [name]: value,
    });
  };

  const validateForm = useMemo(() => {
    return (
      attributeForm.name.trim() !== "" &&
      typeof attributeForm.required === "boolean" &&
      typesArray.includes(attributeForm.type)
    );
  }, [attributeForm]);

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
    const payload = {
      ...attributeForm,
      scope: type,
      order: 1,
    };

    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, payload],
    }));

    setAttributes((prev) => ({
      ...prev,
      ...(type === "PRODUCT"
        ? { productAttributes: [...prev.productAttributes, payload] }
        : { variantAttributes: [...prev.variantAttributes, payload] }),
    }));

    setIsDialogOpen(false);
  };

  useEffect(() => {
    setAttributeForm(AttributeFormInitialState);
  }, [isDialogOpen]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {type === "PRODUCT" ? (
          <CardAttributeTable
            title={title}
            attributes={attributes.productAttributes}
            handleEditClick={handleEditClick}
          />
        ) : (
          <CardAttributeTable
            title={title}
            attributes={attributes.variantAttributes}
            handleEditClick={handleEditClick}
          />
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
              name="name"
              type="name"
              placeholder="ej. Platinum"
              value={currentAttribute?.name || attributeForm.name}
              onChange={handleAttributeForm}
              required
            />
            <Label htmlFor="data-type">
              <span className="text-redLabel">*</span>Tipo de Dato
            </Label>
            <Select
              value={currentAttribute?.type || attributeForm.type}
              onValueChange={(value) =>
                setAttributeForm({
                  ...attributeForm,
                  type: value,
                })
              }
            >
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
            <RadioGroup
              value={String(attributeForm.required)}
              onValueChange={(value) =>
                setAttributeForm({
                  ...attributeForm,
                  required: value === "true",
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="r1" />
                <Label htmlFor="r1">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="r2" />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>

            <DialogFooter>
              <Button
                disabled={!validateForm}
                type="submit"
                onClick={handleSubmit}
              >
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
