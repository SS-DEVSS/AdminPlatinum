import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFormState } from "@/hooks/useFormProduct";
import AdditionalInfo from "@/modules/products/AdditionalInfo";
import Attributes from "@/modules/products/Attributes";
import Details from "@/modules/products/Details";
import { ChevronLeft } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategoryContext } from "@/context/categories-context";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";

const NewProduct = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct } = useProducts();
  const { categories } = useCategoryContext();
  const { toast } = useToast();
  const client = axiosClient();

  const {
    detailsState,
    setDetailsState,
    attributesState,
    setAttributesState,
    referencesState,
    setReferencesState,
    applicationsState,
    setApplicationsState,
    canContinue,
    setCanContinue,
  } = useFormState();

  useEffect(() => {
    const loadProductData = async () => {
      if (isEditMode && id) {
        const product = await getProductById(id);
        if (product) {
          // 1. Populate Details
          // Find the category object from context based on product.category.id
          const fullCategory = categories.find(c => c.id === product.category.id) || null;

          // Get the first image URL if available
          const firstImage = product.images && product.images.length > 0 
            ? product.images[0].url 
            : "";

          setDetailsState({
            id: product.id,
            name: product.name,
            type: product.type,
            description: product.description || "",
            category: fullCategory, // Use the full category object found
            references: [], // Handled in referencesState
            sku: product.sku || "",
            brand: product.brand?.id || "",
            imgUrl: firstImage, // Set initial image URL
          });

          // 2. Populate Attributes
          const attrs: any = {};
          if (product.attributeValues && fullCategory) {
            // Get product attributes from category (handle both array and object formats)
            let productAttributes: any[] = [];
            if (Array.isArray(fullCategory.attributes)) {
              productAttributes = fullCategory.attributes.filter((a: any) => a.scope === "PRODUCT");
            } else if (fullCategory.attributes && typeof fullCategory.attributes === 'object' && 'product' in fullCategory.attributes) {
              productAttributes = (fullCategory.attributes as { product: any[] }).product || [];
            }

            product.attributeValues.forEach((av: any) => {
              const attributeDef = productAttributes.find((a: any) => a.id === av.idAttribute && a.scope === "PRODUCT");
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

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!detailsState.name || !detailsState.description || !detailsState.category) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Por favor completa todos los campos requeridos",
        });
        return;
      }

      // Get category ID
      const categoryId = typeof detailsState.category === 'string' 
        ? detailsState.category 
        : detailsState.category?.id;

      if (!categoryId) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Por favor selecciona una categoría",
        });
        return;
      }

      // Get the category to access attributes
      const category = categories.find(c => c.id === categoryId);
      if (!category) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Categoría no encontrada",
        });
        return;
      }

      // Get existing product data if editing
      let existingProduct: any = null;
      if (isEditMode && id) {
        existingProduct = await getProductById(id);
      }

      // Format attributes
      const formattedAttributes: any[] = [];
      if (category.attributes) {
        const productAttributes = Array.isArray(category.attributes)
          ? category.attributes.filter((a: any) => a.scope === "PRODUCT")
          : (category.attributes as any)?.product || [];

        productAttributes.forEach((attr: any) => {
          const value = attributesState[attr.name];
          if (value !== undefined && value !== null && value !== "") {
            // Find the attribute value ID if editing
            let idAttributeValue: string | undefined;
            if (isEditMode && existingProduct?.attributeValues) {
              const existingAttrValue = existingProduct.attributeValues.find(
                (av: any) => av.idAttribute === attr.id
              );
              if (existingAttrValue) {
                idAttributeValue = existingAttrValue.id;
              }
            }

            const attributeValue: any = {
              idAttribute: attr.id,
            };

            // Set the value based on attribute type
            if (attr.type === "STRING" || attr.type === "TEXT") {
              attributeValue.valueString = String(value);
            } else if (attr.type === "NUMBER" || attr.type === "INTEGER" || attr.type === "DECIMAL") {
              attributeValue.valueNumber = Number(value);
            } else if (attr.type === "BOOLEAN") {
              attributeValue.valueBoolean = Boolean(value);
            } else if (attr.type === "DATE") {
              attributeValue.valueDate = new Date(value);
            }

            if (idAttributeValue) {
              attributeValue.idAttributeValue = idAttributeValue;
            }

            formattedAttributes.push(attributeValue);
          }
        });
      }

      // Format references
      const referenceIds = referencesState.references.map(ref => ref.id);

      if (isEditMode && id) {
        // Update product - ProductUpdateRequest format
        // Always include name and description (they should always have values)
        const productPayload: any = {
          name: detailsState.name || "",
          description: detailsState.description || null,
          variants: [], // Required field, but we're not updating variants here
        };

        // Include references if there are any
        if (referenceIds.length > 0) {
          productPayload.references = referenceIds;
        }

        // Include attributes if there are any
        if (formattedAttributes.length > 0) {
          productPayload.attributes = formattedAttributes;
        }

        // If there's a new image, add it to the payload
        // The backend expects imageUrl or imgUrl
        if (detailsState.imgUrl && detailsState.imgUrl.trim() !== "") {
          // Check if it's a full URL or just a path
          // If it's a full URL (starts with http), use it as imageUrl
          // Otherwise, it's already a path and we can use it as imgUrl
          if (detailsState.imgUrl.startsWith('http')) {
            productPayload.imageUrl = detailsState.imgUrl;
          } else {
            productPayload.imgUrl = detailsState.imgUrl;
          }
        }

        console.log("[NewProduct] Updating product with payload:", JSON.stringify(productPayload, null, 2));
        console.log("[NewProduct] Details state:", JSON.stringify(detailsState, null, 2));
        console.log("[NewProduct] Attributes state:", JSON.stringify(attributesState, null, 2));
        console.log("[NewProduct] References state:", JSON.stringify(referencesState, null, 2));

        await updateProduct(id, productPayload);
        toast({
          title: "Producto actualizado",
          variant: "success",
          description: "El producto se ha actualizado correctamente",
        });
      } else {
        // Create product - ProductCreateRequest format
        // Format variants (for SINGLE products, create a variant with the product name)
        const variants: any[] = [];
        if (detailsState.type === "SINGLE") {
          variants.push({
            name: detailsState.name,
            sku: detailsState.sku || null,
            price: null,
            stockQuantity: null,
            attributes: [],
            images: detailsState.imgUrl ? [{ path: detailsState.imgUrl, order: 0 }] : [],
            notes: [],
            technicalSheets: [],
          });
        }

        const productPayload: any = {
          name: detailsState.name,
          sku: detailsState.sku || null,
          description: detailsState.description || null,
          type: detailsState.type || "SINGLE",
          idCategory: categoryId,
          references: referenceIds,
          attributes: formattedAttributes,
          variants: variants,
        };

        await createProduct(productPayload);
        toast({
          title: "Producto creado",
          variant: "success",
          description: "El producto se ha creado correctamente",
        });
      }

      // Navigate back to products list
      navigate("/productos");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error al guardar el producto",
      });
    }
  };

  return (
    <Layout>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/productos">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {isEditMode ? "Editar Producto" : "Nuevo Producto"}
          </p>
        </div>
      </header>
      <section className="flex flex-col gap-4 mt-6 max-w-4xl mx-auto px-4">
        <Details
          detailsState={detailsState}
          setDetailsState={setDetailsState}
          referencesState={referencesState}
          setReferencesState={setReferencesState}
          applicationsState={applicationsState}
          setApplicationsState={setApplicationsState}
        />
        <Attributes
          setCanContinue={setCanContinue}
          categoryId={typeof detailsState.category === 'string' ? detailsState.category : detailsState.category?.id || undefined}
          attributesState={attributesState}
          setAttributesState={setAttributesState}
        />
        <AdditionalInfo setCanContinue={setCanContinue} />
        <section className="flex justify-end gap-3 mt-4">
          <Link to="/productos">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button disabled={!canContinue} onClick={handleSubmit}>
            {isEditMode ? "Actualizar Producto" : "Publicar Producto"}
          </Button>
        </section>
      </section>
    </Layout>
  );
};

export default NewProduct;
