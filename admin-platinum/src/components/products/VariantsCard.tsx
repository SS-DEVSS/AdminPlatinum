import { useState } from "react";
import { Product, ProductVariant } from "@/models/product";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import NoData from "../NoData";
import VariantItem from "./VariantContent";

type VariantsCardProps = {
  product?: Product | null;
};

const VariantsCard = ({ product }: VariantsCardProps) => {
  const [showForm, setShowForm] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants ? product.variants : []
  );
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const handleAddClickVariant = () => {
    setShowForm(true);
    setOpenItems([`item-${variants.length}`]);
  };

  const handleAddVariant = (newVariant: ProductVariant) => {
    setVariants((prev) => [...prev, newVariant]);
    setShowForm(false);
    setOpenItems([]);
  };

  const handleCancel = () => {
    setShowForm(false);
    setOpenItems([]);
  };

  return (
    <Card className="w-full flex flex-col mt-5">
      <CardHeader>
        <CardTitle>Variantes</CardTitle>
        <CardDescription>
          Agrega cualquier tipo de notas relevantes para los visitantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 py-0">
        <Accordion
          type="multiple"
          collapsible
          className="w-full"
          value={openItems}
          onValueChange={(value: any) => !showForm && setOpenItems(value)}
        >
          {variants.length === 0 && !showForm ? (
            <section className="mb-5">
              <NoData>
                <p>No hay variantes asociadas.</p>
              </NoData>
            </section>
          ) : (
            <>
              {variants.map((variant, index) => (
                <VariantItem
                  key={variant.id}
                  index={index}
                  product={product}
                  variant={variant}
                  handleDeleteVariant={handleDeleteVariant}
                  setVariants={setVariants}
                  isLast={index + 1 === variants.length}
                  showForm={showForm}
                  setOpenItems={setOpenItems}
                />
              ))}
            </>
          )}
          {showForm && (
            <VariantItem
              index={variants.length}
              product={product}
              setVariants={setVariants}
              showForm={showForm}
              handleAddVariant={handleAddVariant}
              isLast={true}
              setOpenItems={setOpenItems}
              newVariant
            />
          )}
        </Accordion>
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        {showForm ? (
          <Button variant="outline" onClick={handleCancel} className="py-5">
            Cancelar
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 hover:bg-slate-100 hover:text-black py-5"
            onClick={handleAddClickVariant}
            disabled={showForm}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-2" />
            Agregar Variante
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VariantsCard;
