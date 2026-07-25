import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { detailsType, stateSkeleton, useFormState } from "@/hooks/useFormProduct";
import AdditionalInfo from "@/modules/products/AdditionalInfo";
import Details from "@/modules/products/Details";
import { ChevronLeft, Trash2 } from "lucide-react";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import { useProducts } from "@/hooks/useProducts";
import { useCategoryContext } from "@/context/categories-context";
import { useToast } from "@/hooks/use-toast";
import { resolveProductNameForSave } from "@/utils/adminFieldVisibility";
import { invalidateProductListCache } from "@/utils/productListCache";
import Loader from "@/components/Loader";
import { Reference } from "@/models/reference";
import { Application } from "@/models/application";
import { persistNewReferences } from "@/services/referenceService";
import axiosClient from "@/services/axiosInstance";
import { syncProductApplicationDeletions } from "@/utils/syncProductApplicationDeletions";
import { syncProductReferenceDeletions } from "@/utils/syncProductReferenceDeletions";

function normalizeAttributeValue(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function buildFormSnapshot(
  details: detailsType,
  attributes: Record<string, unknown>,
  references: Reference[],
  applications: Application[] = [],
): string {
  const categoryId =
    typeof details.category === "string"
      ? details.category
      : details.category?.id ?? null;

  const normalizedAttributes = Object.fromEntries(
    Object.entries(attributes)
      .map(([key, value]): [string, unknown] => [key, normalizeAttributeValue(value)])
      .filter((entry): entry is [string, unknown] => entry[1] !== null)
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  const referenceKeys = references
    .map(
      (reference) =>
        `${reference.id ?? ""}|${reference.referenceBrand ?? ""}|${reference.referenceNumber ?? ""}|${reference.type ?? ""}|${reference.description ?? ""}`,
    )
    .sort();

  const applicationIds = applications
    .map((application) => application.id ?? "")
    .filter(Boolean)
    .sort();

  return JSON.stringify({
    details: {
      sku: details.sku.trim(),
      description: details.description.trim(),
      imgUrl: details.imgUrl ?? "",
      visibleInCatalog: details.visibleInCatalog,
      categoryId,
      subcategoryId: details.subcategory?.id ?? null,
    },
    attributes: normalizedAttributes,
    referenceKeys,
    applicationIds,
  });
}

type ProductAttributeValueRef = {
  id: string;
  idAttribute: string;
};

type InitialFormData = {
  details: detailsType;
  attributes: Record<string, unknown>;
  references: Reference[];
  applications: Application[];
  productAttributeValues: ProductAttributeValueRef[];
};

function cloneInitialFormData(data: InitialFormData): InitialFormData {
  return {
    details: {
      ...data.details,
      category: data.details.category ? { ...data.details.category } : null,
      subcategory: data.details.subcategory ? { ...data.details.subcategory } : null,
    },
    attributes: { ...data.attributes },
    references: data.references.map((reference) => ({ ...reference })),
    applications: data.applications.map((application) => ({ ...application })),
    productAttributeValues: data.productAttributeValues.map((value) => ({ ...value })),
  };
}

const NewProduct = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategoryContext();
  const { toast } = useToast();
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const savingStartTimeRef = useRef<number | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(() =>
    id ? null : buildFormSnapshot(stateSkeleton, {}, [], []),
  );
  const initialFormDataRef = useRef<InitialFormData>({
    details: { ...stateSkeleton },
    attributes: {},
    references: [],
    applications: [],
    productAttributeValues: [],
  });
  const pendingDeletedReferenceIdsRef = useRef<Set<string>>(new Set());
  const pendingDeletedApplicationIdsRef = useRef<Set<string>>(new Set());
  const [relationsRevision, setRelationsRevision] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);
  const loadedProductIdRef = useRef<string | null>(null);

  const handleApplicationsChange = useCallback((applications: Application[]) => {
    setCurrentProduct((prev: { applications?: Application[] } | null) =>
      prev ? { ...prev, applications } : prev,
    );
  }, []);

  const handleApplicationsDeleted = useCallback((applicationIds: string[]) => {
    applicationIds.forEach((applicationId) => {
      pendingDeletedApplicationIdsRef.current.add(applicationId);
    });
    setRelationsRevision((value) => value + 1);
  }, []);

  const handleApplicationsMutated = useCallback(() => {
    setRelationsRevision((value) => value + 1);
  }, []);

  const handleReferenceDeleted = useCallback((referenceId: string) => {
    pendingDeletedReferenceIdsRef.current.add(referenceId);
    setRelationsRevision((value) => value + 1);
  }, []);

  const handleReferencesMutated = useCallback(() => {
    setRelationsRevision((value) => value + 1);
  }, []);

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
    loadedProductIdRef.current = null;
  }, [id]);

  useEffect(() => {
    const loadProductData = async () => {
      if (isEditMode && id) {
        setIsLoadingProduct(true);
        const product = await getProductById(id, { view: "edit" });
        if (product) {
          setCurrentProduct(product);
          // 1. Populate Details
          // Find the category object from context based on product.category.id
          const categoryId = product.category?.id || product.category;

          let fullCategory =
            categories.find((c) => c.id === categoryId) || null;

          // If category not found in context, create a basic category object from product data
          if (!fullCategory && product.category) {
            fullCategory = {
              id: product.category.id || product.category,
              name: product.category.name || "Categoría desconocida",
            } as any;
          }

          // Get the first image URL if available
          const firstImage =
            product.images && product.images.length > 0
              ? product.images[0].url
              : "";

          // Get brand from product, or from category's brands if product doesn't have one
          let brandId = product.brand?.id || "";
          if (
            !brandId &&
            fullCategory?.brands &&
            fullCategory.brands.length > 0
          ) {
            // Use the first brand from the category
            brandId = fullCategory.brands[0].id || "";
          }

          const subcategoryFromProduct = (product as any).idSubcategory
            ? {
                id: (product as any).idSubcategory,
                name: (product as any).subcategory?.name ?? "",
              }
            : null;

          setDetailsState({
            id: product.id,
            name: product.name,
            type: product.type,
            description: product.description || "",
            category: fullCategory,
            subcategory: subcategoryFromProduct,
            references: [],
            sku: product.sku || "",
            brand: brandId,
            imgUrl: firstImage,
            visibleInCatalog:
              (product as { visibleInCatalog?: boolean }).visibleInCatalog ??
              (product as { visible_in_catalog?: boolean })
                .visible_in_catalog ??
              true,
          });

          const loadedDetails: detailsType = {
            id: product.id,
            name: product.name,
            type: product.type,
            description: product.description || "",
            category: fullCategory,
            subcategory: subcategoryFromProduct,
            references: [],
            sku: product.sku || "",
            brand: brandId,
            imgUrl: firstImage,
            visibleInCatalog:
              (product as { visibleInCatalog?: boolean }).visibleInCatalog ??
              (product as { visible_in_catalog?: boolean })
                .visible_in_catalog ??
              true,
          };

          // 2. Populate Attributes
          const attrs: any = {};
          if (product.attributeValues && fullCategory) {
            // Get product attributes from category (handle both array and object formats)
            let productAttributes: any[] = [];
            if (Array.isArray(fullCategory.attributes)) {
              productAttributes = fullCategory.attributes.filter(
                (a: any) => a.scope === "PRODUCT",
              );
            } else if (
              fullCategory.attributes &&
              typeof fullCategory.attributes === "object" &&
              "product" in fullCategory.attributes
            ) {
              productAttributes =
                (fullCategory.attributes as { product: any[] }).product || [];
            }

            product.attributeValues.forEach((av: any) => {
              const attributeDef = productAttributes.find(
                (a: any) => a.id === av.idAttribute && a.scope === "PRODUCT",
              );
              if (attributeDef) {
                attrs[attributeDef.name] =
                  av.valueString ||
                  av.valueNumber ||
                  av.valueBoolean ||
                  av.valueDate;
              }
            });
          }
          setAttributesState(attrs);

          const productAttributeValues: ProductAttributeValueRef[] = (product.attributeValues ?? [])
            .map((av: { id?: string; idAttribute?: string; id_attribute?: string }) => ({
              id: av.id ?? "",
              idAttribute: av.idAttribute ?? av.id_attribute ?? "",
            }))
            .filter((av: ProductAttributeValueRef) => av.id && av.idAttribute);

          // 3. Populate References from dedicated endpoint
          let loadedReferences: Reference[] = [];
          try {
            const refsResponse = await axiosClient().get(`/references/product/${id}`);
            loadedReferences = refsResponse.data?.references ?? [];
          } catch {
            loadedReferences = [];
          }
          setReferencesState({ references: loadedReferences });

          setInitialSnapshot(
            buildFormSnapshot(loadedDetails, attrs, loadedReferences, []),
          );
          initialFormDataRef.current = cloneInitialFormData({
            details: loadedDetails,
            attributes: attrs,
            references: loadedReferences,
            applications: [],
            productAttributeValues,
          });

          loadedProductIdRef.current = id;
        }
        setIsLoadingProduct(false);
      }
    };

    if (categories.length > 0) {
      loadProductData();
    }
  }, [isEditMode, id, categories]); // Depend on categories to ensure they are loaded first

  const hasUnsavedChanges = useMemo(() => {
    if (initialSnapshot === null) return false;
    if (relationsRevision > 0) return true;
    return (
      buildFormSnapshot(
        detailsState,
        attributesState,
        referencesState.references,
        applicationsState.applications,
      ) !== initialSnapshot
    );
  }, [
    initialSnapshot,
    detailsState,
    attributesState,
    referencesState,
    applicationsState.applications,
    relationsRevision,
  ]);

  const handleDiscard = () => {
    const initial = cloneInitialFormData(initialFormDataRef.current);
    setDetailsState(initial.details);
    setAttributesState(initial.attributes);
    setReferencesState({ references: initial.references });
    setApplicationsState({ applications: initial.applications });
    pendingDeletedReferenceIdsRef.current.clear();
    pendingDeletedApplicationIdsRef.current.clear();
    setRelationsRevision(0);
    setFormResetKey((key) => key + 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    const startTime = Date.now();
    savingStartTimeRef.current = startTime;

    try {
      // Validate required fields
      const missingFields: string[] = [];
      if (!detailsState.sku || detailsState.sku.trim() === "") {
        missingFields.push("SKU");
      }
      if (!detailsState.description || detailsState.description.trim() === "") {
        missingFields.push("Descripción");
      }
      if (!detailsState.category) {
        missingFields.push("Categoría");
      }

      if (missingFields.length > 0) {
        toast({
          title: "Error",
          variant: "destructive",
          description: `Por favor completa los siguientes campos requeridos: ${missingFields.join(", ")}`,
        });
        setIsSubmitting(false);
        savingStartTimeRef.current = null;
        return;
      }

      // Get category ID
      const categoryId =
        typeof detailsState.category === "string"
          ? detailsState.category
          : detailsState.category?.id;

      if (!categoryId) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Por favor selecciona una categoría",
        });
        setIsSubmitting(false);
        savingStartTimeRef.current = null;
        return;
      }

      // Get the category to access attributes
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Categoría no encontrada",
        });
        setIsSubmitting(false);
        savingStartTimeRef.current = null;
        return;
      }

      // Format attributes
      const formattedAttributes: Array<Record<string, unknown>> = [];
      if (category.attributes) {
        const productAttributes = Array.isArray(category.attributes)
          ? category.attributes.filter((a: { scope?: string }) => a.scope === "PRODUCT")
          : (category.attributes as { product?: Array<{ id: string; name: string; type?: string }> }).product || [];

        productAttributes.forEach((attr) => {
          const value = attributesState[attr.name];
          if (value !== undefined && value !== null && value !== "") {
            let idAttributeValue: string | undefined;
            if (isEditMode) {
              const existingAttrValue = initialFormDataRef.current.productAttributeValues.find(
                (av) => av.idAttribute === attr.id,
              );
              if (existingAttrValue) {
                idAttributeValue = existingAttrValue.id;
              }
            }

            if (isEditMode && !idAttributeValue) {
              return;
            }

            const attributeValue: Record<string, unknown> = {
              idAttribute: attr.id,
            };

            if (
              attr.type === "STRING" ||
              attr.type === "TEXT" ||
              attr.type?.toLowerCase() === "string" ||
              attr.type?.toLowerCase() === "text"
            ) {
              attributeValue.valueString = String(value);
              attributeValue.valueNumber = null;
              attributeValue.valueBoolean = null;
              attributeValue.valueDate = null;
            } else if (
              attr.type === "NUMBER" ||
              attr.type === "NUMERIC" ||
              attr.type === "INTEGER" ||
              attr.type === "DECIMAL" ||
              attr.type?.toLowerCase() === "number" ||
              attr.type?.toLowerCase() === "numeric"
            ) {
              attributeValue.valueNumber = Number(value);
              attributeValue.valueString = null;
              attributeValue.valueBoolean = null;
              attributeValue.valueDate = null;
            } else if (
              attr.type === "BOOLEAN" ||
              attr.type?.toLowerCase() === "boolean"
            ) {
              attributeValue.valueBoolean = Boolean(value);
              attributeValue.valueString = null;
              attributeValue.valueNumber = null;
              attributeValue.valueDate = null;
            } else if (
              attr.type === "DATE" ||
              attr.type?.toLowerCase() === "date"
            ) {
              attributeValue.valueDate =
                value instanceof Date ? value : new Date(value);
              attributeValue.valueString = null;
              attributeValue.valueNumber = null;
              attributeValue.valueBoolean = null;
            }

            if (isEditMode) {
              if (!idAttributeValue) {
                return;
              }
              attributeValue.idAttributeValue = idAttributeValue;
            }

            formattedAttributes.push(attributeValue);
          }
        });
      }

      const productName = resolveProductNameForSave(
        detailsState.name,
        detailsState.sku,
      );

      // Format references - new refs are persisted via POST /references (full metadata)
      if (isEditMode && id) {
        await persistNewReferences(id, referencesState.references);

        const idSubcategory = detailsState.subcategory?.id ?? null;
        const productPayload: Record<string, unknown> = {
          name: productName,
          description: detailsState.description || null,
          idSubcategory,
          visibleInCatalog: detailsState.visibleInCatalog,
        };

        const referencesToRemoveIds = Array.from(pendingDeletedReferenceIdsRef.current);
        const applicationIdsToDelete = Array.from(pendingDeletedApplicationIdsRef.current);

        // Include attributes if there are any
        if (formattedAttributes.length > 0) {
          productPayload.attributes = formattedAttributes;
        }

        // If there's a new image, add it to the payload
        // The backend expects imageUrl or imgUrl
        if (detailsState.imgUrl && detailsState.imgUrl.trim() !== "") {
          if (detailsState.imgUrl.startsWith("http")) {
            productPayload.imageUrl = detailsState.imgUrl;
          } else {
            productPayload.imgUrl = detailsState.imgUrl;
          }
        }

        if (referencesToRemoveIds.length > 0) {
          await syncProductReferenceDeletions({
            client: axiosClient(),
            referenceIdsToDelete: referencesToRemoveIds,
          });
        }

        if (applicationIdsToDelete.length > 0) {
          await syncProductApplicationDeletions({
            client: axiosClient(),
            productId: id,
            applicationIdsToDelete,
          });
        }

        await updateProduct(id, productPayload);

        pendingDeletedReferenceIdsRef.current.clear();
        pendingDeletedApplicationIdsRef.current.clear();
        setRelationsRevision(0);

        toast({
          title: "Producto actualizado",
          variant: "success",
          description: "El producto se ha actualizado correctamente",
        });
      } else {
        // Create product - ProductCreateRequest format
        // Format variants (for SINGLE products, create a variant with the product name)
        const productType = (detailsState.type || "SINGLE").toUpperCase();
        const variants: any[] = [];

        // Always create a variant for SINGLE products (default type)
        // Since type defaults to SINGLE, we should always create a variant
        if (productType === "SINGLE" || !detailsState.type) {
          variants.push({
            name: productName,
            sku: detailsState.sku || null,
            price: null,
            stockQuantity: null,
            attributes: [],
            images: [], // Images will be added after product creation
          });
        }

        const productPayload: any = {
          name: productName,
          sku: detailsState.sku || null,
          description: detailsState.description || null,
          type: productType,
          idCategory: categoryId,
          idSubcategory: detailsState.subcategory?.id ?? null,
          references: [],
          attributes: Array.isArray(formattedAttributes)
            ? formattedAttributes
            : [],
          variants: variants,
        };

        // If there's an image, add it to the payload
        // The backend expects imageUrl or imgUrl
        if (detailsState.imgUrl && detailsState.imgUrl.trim() !== "") {
          // Check if it's a full URL or just a path
          // If it's a full URL (starts with http), use it as imageUrl
          // Otherwise, it's already a path and we can use it as imgUrl
          if (detailsState.imgUrl.startsWith("http")) {
            productPayload.imageUrl = detailsState.imgUrl;
          } else {
            productPayload.imgUrl = detailsState.imgUrl;
          }
        }

        const created = await createProduct(productPayload);

        const createdProductId =
          (created as { id?: string; product?: { id?: string } })?.id ??
          (created as { product?: { id?: string } })?.product?.id;

        if (createdProductId && referencesState.references.length > 0) {
          await persistNewReferences(createdProductId, referencesState.references);
        }

        toast({
          title: "Producto creado",
          variant: "success",
          description: "El producto se ha creado correctamente.",
        });
      }

      // Ensure loader is shown for at least 800ms for better UX
      const elapsed = savingStartTimeRef.current
        ? Date.now() - savingStartTimeRef.current
        : 0;
      const minDisplayTime = 800;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        setIsSubmitting(false);
        savingStartTimeRef.current = null;
        invalidateProductListCache();
        navigate("/dashboard/productos");
      }, remainingTime);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      setIsSubmitting(false);
      savingStartTimeRef.current = null;

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Error al guardar el producto";

      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(id);
      toast({ title: "Producto eliminado", variant: "success" });
      invalidateProductListCache();
      navigate("/dashboard/productos");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Error al eliminar producto";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  if (isLoadingProduct) {
    return <Loader fullScreen message="Cargando producto..." />;
  }

  return (
    <>
      {isSubmitting && <Loader fullScreen message="Guardando cambios..." />}
      <Layout>
        <div className="mx-auto w-full max-w-[1400px]">
        <header className="flex justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/productos">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xl font-semibold leading-none tracking-tight">
              {isEditMode ? "Editar Producto" : "Nuevo Producto"}
            </p>
          </div>
        </header>
        <section className={`flex flex-col gap-5 w-full ${hasUnsavedChanges ? "pb-28" : "pb-5"}`}>
          <Details
            key={formResetKey}
            detailsState={detailsState}
            setDetailsState={setDetailsState}
            referencesState={referencesState}
            setReferencesState={setReferencesState}
            applicationsState={applicationsState}
            setApplicationsState={setApplicationsState}
            product={isEditMode ? currentProduct : null}
            attributesState={attributesState}
            setAttributesState={setAttributesState}
            setCanContinue={setCanContinue}
            onApplicationsChange={handleApplicationsChange}
            onApplicationsDeleted={handleApplicationsDeleted}
            onApplicationsMutated={handleApplicationsMutated}
            onReferenceDeleted={handleReferenceDeleted}
            onReferencesMutated={handleReferencesMutated}
          />
          {isEditMode && (
            <>
              <AdditionalInfo
                setCanContinue={setCanContinue}
                product={currentProduct}
              />
              <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                <h2 className="text-base font-semibold text-destructive">Zona de peligro</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Eliminar este producto borrará de forma permanente imágenes, aplicaciones,
                  referencias y variantes asociadas.
                </p>
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar producto
                </Button>
              </section>
            </>
          )}
        </section>
        </div>
        {hasUnsavedChanges && (
        <section className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleDiscard} type="button">
              Descartar
            </Button>
            <Button
              disabled={!canContinue || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting
                ? "Guardando..."
                : isEditMode
                  ? "Guardar cambios"
                  : "Publicar Producto"}
            </Button>
          </div>
        </section>
        )}
      </Layout>

      <ConfirmActionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar producto"
        description="Se eliminará este producto de forma permanente."
        consequences={[
          "Imágenes, aplicaciones, referencias y variantes asociadas.",
          "Esta acción no se puede deshacer.",
        ]}
        loading={deleteLoading}
        onConfirm={handleDeleteProduct}
      />
    </>
  );
};

export default NewProduct;
