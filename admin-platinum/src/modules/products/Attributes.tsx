import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Product } from "@/models/product";
import DynamicComponent from "@/components/DynamicComponent";
import { CategoryAtributes } from "@/models/category";
import { useCategoryContext } from "@/context/categories-context";

type AttributesProps = {
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  product?: Product | null;
  categoryId?: string;
  attributesState: any;
  setAttributesState: React.Dispatch<React.SetStateAction<any>>;
};

const Attributes = ({
  setCanContinue,
  categoryId,
  attributesState,
  setAttributesState,
}: AttributesProps) => {
  const { categories } = useCategoryContext();

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  const handleAttributeChange = (name: string, value: any) => {
    setAttributesState((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation logic
  useEffect(() => {
    if (!selectedCategory?.attributes?.product) {
      setCanContinue(true); // No attributes to fill
      return;
    }

    const isValid = selectedCategory.attributes.product.every((attr) => {
      if (attr.required) {
        return (
          attributesState[attr.name] !== undefined &&
          attributesState[attr.name] !== ""
        );
      }
      return true;
    });

    setCanContinue(isValid);
  }, [attributesState, selectedCategory, setCanContinue]);

  if (!categoryId) {
    return (
      <Card className="w-full flex flex-col mt-5">
        <CardContent className="py-10 text-center">
          <p>Por favor selecciona una categoría en el paso anterior.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Atributos de Categoría: {selectedCategory?.name}</CardTitle>
        <CardDescription>
          Ingrese los atributos asociados a la categoría
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between gap-4">
        {selectedCategory?.attributes?.product?.map(
          (attribute: CategoryAtributes, index: number) => (
            <div key={attribute.id} className="basis-[48%]">
              <Label className="mb-2 block">
                {attribute.required && <span className="text-red-500 mr-1">*</span>}
                {attribute.name}
              </Label>
              <DynamicComponent
                type={attribute.type}
                name={attribute.name}
                required={attribute.required}
                value={attributesState[attribute.name] || ""}
                onChange={(value) => handleAttributeChange(attribute.name, value)}
              />
            </div>
          )
        )}
        {(!selectedCategory?.attributes?.product ||
          selectedCategory.attributes.product.length === 0) && (
            <p className="text-muted-foreground w-full text-center">
              Esta categoría no tiene atributos definidos.
            </p>
          )}
      </CardContent>
    </Card>
  );
};
export default Attributes;
