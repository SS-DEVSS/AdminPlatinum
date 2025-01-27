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
import { ayudaPorfavor } from "@/sampleData/categories";

type AttributesProps = {
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>;
  product?: Product | null;
};

const Attributes = ({ setCanContinue }: AttributesProps) => {
  // const [form, setForm] = useState({});

  // const isFormComplete = useMemo(() => {
  //   return categorySample.attributes?.every((attribute) => {
  //     if (attribute.required) {
  //       return form[attribute.name] && form[attribute.name] !== "";
  //     }
  //     return true;
  //   });
  // }, [form]);

  useEffect(() => {
    setCanContinue(false);
  }, []);

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Atributos de Categoría</CardTitle>
        <CardDescription>
          Ingrese los atributos asociados a la categoría
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between">
        {/* Esta hard coded */}
        {/* {ayudaPorfavor.attributes.product?.map(
          (attribute: CategoryAtributes, index: number) => (
            <Card key={attribute.id} className="basis-[49%] mt-4">
              <CardHeader className="py-4">
                <CardDescription>{`Atributo #${index + 1}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="mb-10">
                  {attribute.required && (
                    <span className="text-redLabel">*</span>
                  )}
                  {attribute.name}
                </Label>
                <DynamicComponent
                  type={attribute.type}
                  name={attribute.name}
                  required={attribute.required}
                />
              </CardContent>
            </Card>
          )
        )} */}
      </CardContent>
    </Card>
  );
};
export default Attributes;
