import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hooks/useFormProduct";
import AdditionalInfo from "@/modules/products/AdditionalInfo";
import Attributes from "@/modules/products/Attributes";
import Details from "@/modules/products/Details";
import Variants from "@/modules/products/Variants";
import { ChevronLeft, Circle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategoryContext } from "@/context/categories-context";

const NewProduct = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { getProductById } = useProducts();
  const { categories } = useCategoryContext();

  const {
    detailsState,
    setDetailsState,
    attributesState,
    setAttributesState,
    referencesState,
    setReferencesState,
    canContinue,
    setCanContinue,
  } = useFormState();

  const [module, setModule] = useState<number>(0);

  const steps = [
    "Detalles de Producto",
    "Attributos de la Categoría",
    "Variantes del Producto",
    "Información y documentos adicionales",
  ];

  useEffect(() => {
    const loadProductData = async () => {
      if (isEditMode && id) {
        const product = await getProductById(id);
        if (product) {
          // 1. Populate Details
          // Find the category object from context based on product.category.id
          const fullCategory = categories.find(c => c.id === product.category.id) || null;

          setDetailsState({
            id: product.id,
            name: product.name,
            type: product.type,
            description: product.description,
            category: fullCategory, // Use the full category object found
            references: [], // Handled in referencesState
            sku: product.sku,
            brand: product.brand?.id || "",
          });

          // 2. Populate Attributes
          const attrs: any = {};
          if (product.attributeValues) {
            product.attributeValues.forEach((av: any) => {
              // Use the attribute ID or Name as key, depending on how Attributes.tsx expects it.
              // Looking at Attributes.tsx, it iterates category attributes and checks attributesState[attr.name].
              // So we need to map the saved values back to the attribute names.

              // We need to find the attribute name. Ideally the backend response includes it in attributeValues
              // or we look it up in the category definition.
              // Assuming product.attributeValues has populated attribute info or we can match by ID.
              // If the backend returns { idAttribute, valueString, ... } and we have the category loaded:

              const attributeDef = fullCategory?.attributes?.product?.find((a: any) => a.id === av.idAttribute);
              if (attributeDef) {
                attrs[attributeDef.name] = av.valueString || av.valueNumber || av.valueBoolean || av.valueDate;
              }
            });
          }
          setAttributesState(attrs);

          // 3. Populate References
          if (product.references) {
            setReferencesState({ references: product.references });
          }
        }
      }
    };

    if (categories.length > 0) {
      loadProductData();
    }
  }, [isEditMode, id, categories]); // Depend on categories to ensure they are loaded first

  const getPage = (module: number) => {
    switch (module) {
      case 0:
        return (
          <Details
            detailsState={detailsState}
            setDetailsState={setDetailsState}
            referencesState={referencesState}
            setReferencesState={setReferencesState}
          />
        );
      case 1:
        return (
          <Attributes
            setCanContinue={setCanContinue}
            categoryId={typeof detailsState.category === 'string' ? detailsState.category : detailsState.category?.id || undefined}
            attributesState={attributesState}
            setAttributesState={setAttributesState}
          />
        );
      case 2:
        return <Variants />;
      case 3:
        return <AdditionalInfo setCanContinue={setCanContinue} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/categorias">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            Nuevo Producto
          </p>
        </div>
      </header>
      <section className="flex justify-center mt-6 gap-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-3">
              <Circle
                fill={module < index ? "#D9D9D9" : "black"}
                className={module < index ? "text-[#D9D9D9]" : "text-black"}
              />
              <p className={module === index ? "font-bold" : ""}>{step}</p>
            </div>
            {index <= steps.length - 2 && (
              <Separator
                className={`w-44 h-2 rounded-3xl mt-3 ${index < module ? "bg-black" : "bg-[#D9D9D9]"
                  }`}
              />
            )}
          </div>
        ))}
      </section>
      <section className="flex flex-col justify-center gap-4 mt-2">
        {getPage(module)}
        <section className="flex justify-center gap-3">
          {module != 0 && (
            <Button
              onClick={() => setModule((prev) => prev - 1)}
              className="w-28"
              variant="outline"
            >
              Anterior
            </Button>
          )}
          {module != 3 ? (
            <Button
              disabled={!canContinue}
              onClick={() => setModule((prev) => prev + 1)}
              className="w-28"
            >
              Siguiente
            </Button>
          ) : (
            <Button className="w-28">Publicar</Button>
          )}
        </section>
      </section>
    </Layout>
  );
};

export default NewProduct;
