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
  required: boolean | null;
  order?: number;
  scope?: "VARIANT" | "PRODUCT";
}

const AttributeFormInitialState = {
  name: "",
  type: "",
  required: null,
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

  console.log(currentAttribute);

  const handleAddClick = () => {
    setCurrentAttribute(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleEditClick = (attribute: CategoryAtributes) => {
    setDialogMode("edit");
    setIsDialogOpen(true);

    console.log(attribute);
    setCurrentAttribute(attribute);

    setAttributeForm({
      name: attribute.name,
      type: attribute.type,
      required: true,
      order: attribute.order,
      scope: attribute.scope,
    });
  };

  useEffect(() => {
    console.log("attributeForm updated:", attributeForm);
  }, [attributeForm]);

  console.log(attributes);
  console.log(form.attributes);

  const handleDeleteClick = (name: string) => {
    const tempList = (
      type === "PRODUCT"
        ? attributes.productAttributes
        : attributes.variantAttributes
    ).filter((attribute: CategoryAtributes) => attribute.name !== name);

    if (type === "PRODUCT") {
      setAttributes({
        ...attributes,
        productAttributes: tempList,
      });
    } else {
      setAttributes({
        ...attributes,
        variantAttributes: tempList,
      });
    }

    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.name !== name),
    }));
  };

  const handleSubmit = () => {
    const order =
      type === "PRODUCT"
        ? attributes.productAttributes.length
        : attributes.variantAttributes.length;

    const payload =
      dialogMode === "add"
        ? {
            ...attributeForm,
            scope: type,
            order,
          }
        : attributeForm;

    console.log("payload", payload);

    if (dialogMode === "add") {
      // Adding a new attribute
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
    } else if (dialogMode === "edit") {
      setForm((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr) =>
          attr.name === currentAttribute?.name ? payload : attr
        ),
      }));

      setAttributes((prev) => ({
        ...prev,
        ...(type === "PRODUCT"
          ? {
              productAttributes: prev.productAttributes.map((attr) =>
                attr.name === currentAttribute?.name ? payload : attr
              ),
            }
          : {
              variantAttributes: prev.variantAttributes.map((attr) =>
                attr.name === currentAttribute?.name ? payload : attr
              ),
            }),
      }));
    }

    setIsDialogOpen(false);
    setCurrentAttribute(null);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setAttributeForm(AttributeFormInitialState);
    }
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
            handleEditClick={handleEditClick}
            title={title}
            attributes={attributes.productAttributes}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <CardAttributeTable
            handleEditClick={handleEditClick}
            title={title}
            attributes={attributes.variantAttributes}
            handleDeleteClick={handleDeleteClick}
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
              value={attributeForm.name || ""}
              onChange={handleAttributeForm}
              required
            />
            <Label htmlFor="data-type">
              <span className="text-redLabel">*</span>Tipo de Dato
            </Label>
            <Select
              value={attributeForm.type}
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
