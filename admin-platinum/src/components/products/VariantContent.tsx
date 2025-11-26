import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Product, ProductVariant } from "@/models/product";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import DynamicComponent from "../DynamicComponent";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type VariantItemProps = {
  index?: number;
  product?: Product | null;
  variant?: ProductVariant;
  handleDeleteVariant?: (id: string) => void;
  setVariants?: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
  handleAddVariant?: (newVariant: ProductVariant) => void;
  isLast: boolean;
  showForm: boolean;
  setOpenItems: React.Dispatch<React.SetStateAction<string[]>>;
  newVariant?: boolean;
};

const VariantItem = ({
  index,
  product,
  variant = {
    id: "",
    img_url: "",
    name: "",
    sku: "",
  },
  handleDeleteVariant,
  setVariants,
  handleAddVariant,
  isLast,
  showForm,
  setOpenItems,
  newVariant,
}: VariantItemProps) => {
  const [name, setName] = useState(variant.name);
  const [sku, setSku] = useState(variant.sku);

  const handleAdd = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      img_url: variant.img_url,
      name,
      sku,
    };
    handleAddVariant && handleAddVariant(newVariant);
  };

  const handleUpdate = () => {
    setVariants?.((prev) =>
      prev.map((v) => (v.id === variant.id ? { ...v, name, sku } : v))
    );
    setOpenItems([]);
  };

  return (
    <AccordionItem
      value={`item-${index}`}
      className={`${!isLast ? "" : "border-none p-0"} ${
        newVariant
          ? "border border-dashed border-indigo-500 bg-indigo-50 rounded-xl pr-7 pl-2"
          : ""
      }`}
    >
      <AccordionTrigger className="flex justify-between flex-1 w-full">
        <p className="mr-auto">{name || "Nueva Variante"}</p>
        {handleDeleteVariant && variant.id && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteVariant(variant.id);
            }}
            variant="ghost"
            className="p-0 hover:text-slate-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        <section className="flex gap-4">
          <Card className="basis-1/2 p-4">
            <Label htmlFor="sku">
              <span className="text-redLabel">*</span>SKU
            </Label>
            <Input
              name="sku"
              className="my-3"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Label htmlFor="name">
              <span className="text-redLabel">*</span>Nombre
            </Label>
            <Input
              name="name"
              className="mt-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Card>
          <Card className="basis-1/2 p-4">
            <Label>Imágenes</Label>
            <section className="my-3 flex gap-3">
              <button className="flex aspect-square max-w-[124px] w-full items-center justify-center rounded-md border border-dashed">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Upload</span>
              </button>
            </section>
          </Card>
        </section>

        <CardContent className="flex flex-wrap justify-between p-0">
          {product?.attributes?.map((attribute: any, index) => (
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
          ))}
        </CardContent>
        <div className="mt-4 flex justify-center gap-3">
          {showForm ? (
            <>
              <Button onClick={handleAdd}>Agregar Variante</Button>
            </>
          ) : (
            <Button onClick={handleUpdate}>Actualizar Variante</Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default VariantItem;
