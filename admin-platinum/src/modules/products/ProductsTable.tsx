import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { AttributeValue, Item, Variant } from "@/models/product";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/models/category";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyDropzone from "@/components/Dropzone";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/services/axiosInstance";
import { convertImageToWebP } from "@/utils/imageConverter";

interface DataTableProps {
  category?: Category | null;
  searchFilter?: string;
}

const DataTable = ({ category, searchFilter }: DataTableProps) => {
  const [mappedData, setMappedData] = useState<Variant[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [previewVariant, setPreviewVariant] = useState<Variant | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInProgressRef = useRef(false);
  const lastUploadedFileRef = useRef<string>("");
  const { uploading } = useS3FileManager();
  const { toast } = useToast();
  const client = axiosClient();

  let { attributes } = category || {};
  const { products, loading, getProducts } = useProducts();
  const { categories } = useCategories();

  if (!attributes && categories.length > 0) {
    // attributes = categories[0].attributes;
    attributes = categories[0].attributes;
  }

  const handleImageClick = (variant: Variant) => {
    setSelectedVariant(variant);
    setImageFile({} as File); // Reset file when opening dialog
    lastUploadedFileRef.current = ""; // Reset last uploaded file
    uploadInProgressRef.current = false; // Reset upload flag
    setIsUploading(false);
    setImageDialogOpen(true);
  };

  const handlePreviewImage = (imageUrl: string, variant?: Variant) => {
    setPreviewImageUrl(imageUrl);
    setPreviewVariant(variant || null);
    setPreviewDialogOpen(true);
  };

  // Obtener la URL de la imagen actual del variant seleccionado
  const getCurrentImageUrl = (): string | undefined => {
    if (!selectedVariant) return undefined;
    const images = selectedVariant.images;
    if (images && Array.isArray(images) && images.length > 0) {
      return images[images.length - 1].url;
    }
    return undefined;
  };

  const handleDeleteImage = async (variant?: Variant | null) => {
    const variantToDelete = variant || selectedVariant;
    if (!variantToDelete) return;

    const isPseudoVariant = variantToDelete.id === variantToDelete.idProduct;
    
    if (!isPseudoVariant) {
      // Para variants, necesitaríamos un endpoint diferente o manejar de otra forma
      toast({
        title: "No se puede eliminar la imagen de un variant desde aquí",
        variant: "destructive",
      });
      return;
    }

    try {
      await client.delete(`/products/${variantToDelete.id}/images`);
      
      toast({
        title: "Imagen eliminada correctamente",
        variant: "success",
      });

      // Actualizar la lista de productos
      await getProducts();
      
      // Cerrar los diálogos
      setPreviewDialogOpen(false);
      setImageDialogOpen(false);
      setSelectedVariant(null);
      setPreviewVariant(null);
      setImageFile({} as File);
    } catch (error: any) {
      console.error("[ProductsTable] Error deleting image:", error);
      toast({
        title: "Error al eliminar imagen",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error desconocido",
      });
    }
  };

  const handleImageUpload = async () => {
    // Prevent multiple simultaneous uploads
    if (uploadInProgressRef.current || isUploading || !selectedVariant || !imageFile.name) {
      return;
    }

    // Check if this file was already uploaded
    const fileIdentifier = `${imageFile.name}-${imageFile.size}-${imageFile.lastModified}`;
    if (lastUploadedFileRef.current === fileIdentifier) {
      return;
    }

    uploadInProgressRef.current = true;
    setIsUploading(true);
    lastUploadedFileRef.current = fileIdentifier;

    try {
      // Check if this is a real variant or a pseudo-variant (product without variants)
      // If idProduct === id, it means it's a SINGLE product without variants
      const isPseudoVariant = selectedVariant.id === selectedVariant.idProduct;
      
      if (isPseudoVariant) {
        // For SINGLE products, use the POST /products/:id/images endpoint
        // This endpoint accepts files directly and creates ProductImage records
        // We'll use replace=true query parameter to replace existing images
        
        // Convertir imagen a WebP antes de subir
        let fileToUpload = imageFile;
        if (imageFile.type.startsWith('image/')) {
          try {
            fileToUpload = await convertImageToWebP(imageFile);
          } catch (error) {
            console.error("[ProductsTable] Error al convertir imagen, usando original:", error);
            fileToUpload = imageFile;
          }
        }
        
        const formData = new FormData();
        formData.append('images', fileToUpload);
        
        await client.post(`/products/${selectedVariant.id}/images?replace=true`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        toast({
          title: "Imagen actualizada correctamente",
          variant: "success",
        });
        
        // Fetch the updated product to get the new image
        try {
          const updatedProduct = await client.get(`/products/${selectedVariant.id}`);
          const productData = updatedProduct.data;
          
          // Try to get images from different possible locations
          let updatedImages: any[] = [];
          
          // Check if images are directly on the product
          if (productData.images && Array.isArray(productData.images)) {
            updatedImages = productData.images;
          }
          // Check if images are in variants (for SINGLE products, there might be a default variant)
          else if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
            updatedImages = productData.variants[0].images || [];
          }
          
          // Update the local state with the new product data
          setMappedData((prevData) => {
            return prevData.map((variant) => {
              if (variant.id === selectedVariant.id) {
                return {
                  ...variant,
                  images: updatedImages
                };
              }
              return variant;
            });
          });
          
          // Also refresh the products list to ensure consistency
          await getProducts();
        } catch (error) {
          console.error("[ProductsTable] Error fetching updated product:", error);
          // If fetching fails, still refresh the whole list
          await getProducts();
        }
      } else {
        // For variants, we need to upload the file first, then use PATCH with imageUrl
        // Since there's no POST /variants/:id/images endpoint, we'll use the file upload endpoint
        // and then PATCH with the imageUrl
        
        // Convertir imagen a WebP antes de subir
        let fileToUpload = imageFile;
        if (imageFile.type.startsWith('image/')) {
          try {
            fileToUpload = await convertImageToWebP(imageFile);
          } catch (error) {
            console.error("[ProductsTable] Error al convertir imagen, usando original:", error);
            fileToUpload = imageFile;
          }
        }
        
        // Upload the file to get the URL
        const formData = new FormData();
        formData.append('file', fileToUpload);
        
        const fileUploadResponse = await client.post('/files/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const imageUrl = fileUploadResponse.data.url;
        
        // Now update the variant with the imageUrl
        await client.patch(`/variants/${selectedVariant.id}`, {
          imageUrl: imageUrl,
        });
        
        toast({
          title: "Imagen actualizada correctamente",
          variant: "success",
        });
        
        // Fetch the updated variant to get the new image
        try {
          const updatedVariant = await client.get(`/variants/${selectedVariant.id}`);
          const updatedImages = (updatedVariant.data as any).images || [];
          
          // Update the local state with the new variant data
          setMappedData((prevData) => {
            return prevData.map((variant) => {
              if (variant.id === selectedVariant.id) {
                return {
                  ...variant,
                  images: updatedImages
                };
              }
              return variant;
            });
          });
        } catch (error) {
          console.error("[ProductsTable] Error fetching updated variant:", error);
          // If fetching fails, still refresh the whole list
          await getProducts();
        }
      }
      
      setImageDialogOpen(false);
      setImageFile({} as File);
      setSelectedVariant(null);
      lastUploadedFileRef.current = "";
      uploadInProgressRef.current = false;
      setIsUploading(false);
    } catch (error: any) {
      console.error("[ProductsTable] Error uploading/updating image:", error);
      console.error("[ProductsTable] Error response:", error.response);
      
      let errorMessage = "Error desconocido";
      if (error.response?.status === 404) {
        errorMessage = `Endpoint no encontrado. El ${selectedVariant.id === selectedVariant.idProduct ? 'producto' : 'variant'} con ID ${selectedVariant.id} no existe o el endpoint no está disponible.`;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error al subir imagen",
        variant: "destructive",
        description: errorMessage,
      });
      uploadInProgressRef.current = false;
      setIsUploading(false);
      lastUploadedFileRef.current = ""; // Reset to allow retry
    }
  };

  // Only trigger upload when a new file is selected (not on every render)
  useEffect(() => {
    if (imageFile && imageFile.name && selectedVariant && !uploadInProgressRef.current && !isUploading) {
      const fileIdentifier = `${imageFile.name}-${imageFile.size}-${imageFile.lastModified}`;
      if (lastUploadedFileRef.current !== fileIdentifier) {
        handleImageUpload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile.name, imageFile.size, imageFile.lastModified]); // Only trigger when file actually changes

  const flattenVariants = (items: Item[]): Variant[] => {
    if (items.length) {
      return items.flatMap((item: Item): Variant[] => {
        const variants = item.variants;

        // If no variants (e.g. SINGLE product), map the item itself as a row
        if (!variants || variants.length === 0) {
          // Create a pseudo-variant from the main item
          // Check if the item has images directly or if we need to fetch them
          // The backend might return images in the item or we need to check variants
          const itemImages = (item as any).images || [];
          const itemSku = (item as any).sku || "";
          const itemAttributeValues = item.attributeValues || [];
          const itemDescription = item.description || "";
          
          return [{
            id: item.id,
            idProduct: item.id,
            sku: itemSku,
            name: item.name,
            description: itemDescription, // Include description from item
            type: item.type, // Include type from item
            price: 0,
            stockQuantity: 0,
            notes: [],
            technicalSheets: [],
            images: itemImages, // Use images from item if available
            kitItems: [],
            attributeValues: itemAttributeValues as any, // Preserve attribute values from item
            productAttributeValues: itemAttributeValues, // Also set for product attributes lookup
            references: item.references || [], // Include references from item
            applications: (item as any).applications || [], // Include applications if available
          } as Variant];
        }

        return variants.map((variant: Variant): Variant => {
          // Get description from parent item if variant doesn't have one
          const variantDescription = (variant as any).description || item.description || "";
          
          return {
            ...variant,
            // Include description from parent item if variant doesn't have one
            description: variantDescription,
            // Preserve attributeValues from the variant, don't override with empty array
            attributeValues: (variant.attributeValues || []) as any,
            // Ensure images are preserved from the variant
            images: variant.images || [],
            // Include type from the parent item if not in variant
            ...((variant as any).type ? {} : { type: item.type }),
            // Include references and applications from parent item
            references: item.references || [],
            applications: (item as any).applications || [],
          } as any;
        });
      });
    }
    return [];
  };

  // Check if there's a "Descripción" attribute with scope PRODUCT and visibleInCatalog: false
  const shouldHideDescription = useMemo(() => {
    if (!attributes) {
      return false;
    }
    
    // Handle both array and object formats
    let productAttributes: any[] = [];
    if (Array.isArray(attributes)) {
      productAttributes = attributes.filter((attr: any) => attr.scope === "PRODUCT");
    } else if (typeof attributes === 'object' && 'product' in attributes) {
      productAttributes = (attributes as { product: any[] }).product || [];
    }
    
    const descripcionAttribute = productAttributes.find(
      (attr: any) => 
        (attr.name === "Descripción" || attr.name === "descripción" || attr.name.toLowerCase() === "descripcion") &&
        attr.scope === "PRODUCT"
    );
    
    if (descripcionAttribute) {
      // Check both camelCase and snake_case versions
      const visibleInCatalog = descripcionAttribute.visibleInCatalog ?? descripcionAttribute.visible_in_catalog;
      return visibleInCatalog === false;
    }
    
    return false;
  }, [attributes]);

  const columns = useMemo(() => {
    
    // Build base columns
    const baseColumns = [
      {
        accessorKey: "images",
        header: "",
        cell: ({ row }: { row: any }) => (
          <div 
            className="w-20 h-20 bg-slate-300 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleImageClick(row.original)}
          >
            {row.getValue("images") && Array.isArray(row.getValue("images")) && row.getValue("images").length > 0 ? (
              <img
                className="m-auto aspect-square p-2 w-full h-full object-contain rounded-lg cursor-pointer"
                src={row.getValue("images")[row.getValue("images").length - 1].url}
                alt={row.original.name}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewImage(row.getValue("images")[row.getValue("images").length - 1].url, row.original);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center text-xs text-gray-500">
                Haz clic para subir
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "sku",
        header: "Sku",
        cell: ({ row }: { row: any }) => {
          const skuValue = row.getValue("sku") || row.original?.sku || "";
          return <div>{skuValue || "N/A"}</div>;
        },
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: any }) => <div>{row.getValue("name")}</div>,
      },
    ];
    
    // Don't add a fixed description column - let the dynamic columns handle it
    // The dynamic columns will show/hide based on visibleInCatalog
    const initialColumns = baseColumns;
    
    // Add type column
    initialColumns.push({
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }: { row: any }) => {
        return (
          <div>
            {row.getValue("type") === "SINGLE" ? "Componente" : "Kit"}
          </div>
        );
      },
    });

    const actionColumn = [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: { row: any }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <Link to={`/producto/${row.original.id}`}>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: "Borrar Producto",
                      description:
                        "Estas seguro que deseas eliminar este producto?",
                      handleDelete: () => handleDeleteProduct(row.original.id),
                    });
                  }}
                >
                  Eliminar
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

    const getColumns = (attributeType: string) => {
      const getAttributeValues = (row: any, attribute: any) => {
        let attributeCollection = [];
        const productAttributeValues = row.original?.productAttributeValues || [];
        const attributeValues = row.original?.attributeValues || [];

        attributeCollection = [productAttributeValues, attributeValues];
        const found = attributeCollection
          .flat()
          .filter((attrValue: AttributeValue | undefined) => attrValue != null)
          .find(
            (attrValue: AttributeValue) =>
              attrValue?.idAttribute === attribute.id
          );
        
        // Special case: if attribute is "Descripción" and not found, use product description
        if (!found && (attribute.name === "Descripción" || attribute.name === "descripción" || attribute.name.toLowerCase() === "descripcion")) {
          const productDescription = row.original?.description || "";
          if (productDescription) {
            // Return a mock AttributeValue with the description
            return {
              id: "description-fallback",
              valueString: productDescription,
              valueNumber: null,
              valueBoolean: null,
              valueDate: null,
              idAttribute: attribute.id
            } as AttributeValue;
          }
        }
        
        return found;
      };

      const getDisplayValue = (value: AttributeValue | undefined) => {
        if (!value) return "N/A";
        // Try all possible value types
        if (value.valueString !== null && value.valueString !== undefined && value.valueString !== "") {
          return value.valueString;
        }
        if (value.valueNumber !== null && value.valueNumber !== undefined) {
          return value.valueNumber.toString();
        }
        if (value.valueBoolean !== null && value.valueBoolean !== undefined) {
          return value.valueBoolean.toString();
        }
        if (value.valueDate) {
          return new Date(value.valueDate).toLocaleDateString();
        }
        return "N/A";
      };

      return (
        (attributes as any)?.[attributeType]?.filter((attribute: any) => {
          // Filter out "Descripción" attribute if it should be hidden
          if (attributeType === "product" && shouldHideDescription) {
            const isDescripcion = attribute.name === "Descripción" || 
                                  attribute.name === "descripción" || 
                                  attribute.name.toLowerCase() === "descripcion";
            if (isDescripcion) {
              return false;
            }
          }
          return true;
        }).map((attribute: any) => {
          return {
            accessorKey: attribute.id,
            header: attribute.name,
            cell: ({ row }: { row: any }) => {
              const value = getAttributeValues(row, attribute);
              return <div>{getDisplayValue(value)}</div>;
            },
          };
        }) || []
      );
    };

    const dynamicColumnsProduct = getColumns("product");
    const dynamicColumnsVariant = getColumns("variant");

    return [
      ...initialColumns,
      ...dynamicColumnsProduct,
      ...dynamicColumnsVariant,
      ...actionColumn,
    ];
  }, [attributes, shouldHideDescription]);

  useEffect(() => {
    const filteredProducts = products.filter(
      (product: Item) => product.category.id === category?.id
    );
    
    const flattenedData = flattenVariants(filteredProducts);
    // También guardar el item original para cada variant para tener acceso a references y applications
    const flattenedWithItem = flattenedData.map((variant) => {
      const originalItem = filteredProducts.find(item => 
        item.id === variant.idProduct || (item.variants?.some(v => v.id === variant.id) || (!item.variants || item.variants.length === 0) && item.id === variant.id)
      );
      return {
        ...variant,
        _originalItem: originalItem || null, // Guardar el item original para acceso a references
      };
    });
    setMappedData(flattenedWithItem as Variant[]);
  }, [products, category]);

  const searchFilteredProducts = useMemo(() => {
    // Si no hay searchFilter, retornar todos los datos
    if (!searchFilter || searchFilter.trim() === "") {
      return mappedData;
    }

    const searchTerm = searchFilter.toLowerCase().trim();
    
    return mappedData.filter((variant: Variant) => {
      const variantAny = variant as any;
      
      // Buscar en nombre
      const nameMatch = variant.name?.toLowerCase().includes(searchTerm) || false;
      
      // Buscar en SKU
      const skuMatch = (variant.sku || "")?.toLowerCase().includes(searchTerm) || false;
      
      // Buscar en descripción (puede estar en variant o item)
      const descriptionMatch = (variantAny.description || "")?.toLowerCase().includes(searchTerm) || false;
      
      // Buscar en atributos (valores de atributos del producto y variant)
      const attributeMatch = 
        (variant.attributeValues || []).some((attr: any) => {
          const value = attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
          return value?.toString().toLowerCase().includes(searchTerm);
        }) ||
        (variantAny.productAttributeValues || []).some((attr: any) => {
          const value = attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
          return value?.toString().toLowerCase().includes(searchTerm);
        });
      
      // Buscar en referencias
      const referencesMatch = (variantAny.references || []).some((ref: any) => {
        return (
          (ref.sku || "").toLowerCase().includes(searchTerm) ||
          (ref.referenceBrand || "").toLowerCase().includes(searchTerm) ||
          (ref.referenceNumber || "").toLowerCase().includes(searchTerm) ||
          (ref.typeOfPart || "").toLowerCase().includes(searchTerm) ||
          (ref.type || "").toLowerCase().includes(searchTerm) ||
          (ref.description || "").toLowerCase().includes(searchTerm) ||
          // Buscar en attributeValues de referencias
          (ref.attributeValues || []).some((attr: any) => {
            const value = attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
            return value?.toString().toLowerCase().includes(searchTerm);
          })
        );
      });
      
      // Buscar en aplicaciones
      const applicationsMatch = (variantAny.applications || []).some((app: any) => {
        // Las aplicaciones del backend tienen: id, sku, origin, attributeValues
        // También pueden tener campos legacy: referenceBrand, referenceNumber, typeOfPart, type, description, displayText
        return (
          (app.id || "").toLowerCase().includes(searchTerm) ||
          (app.sku || "").toLowerCase().includes(searchTerm) ||
          (app.origin || "").toLowerCase().includes(searchTerm) ||
          // Campos legacy (por si acaso existen)
          (app.referenceBrand || "").toLowerCase().includes(searchTerm) ||
          (app.referenceNumber || "").toLowerCase().includes(searchTerm) ||
          (app.typeOfPart || "").toLowerCase().includes(searchTerm) ||
          (app.type || "").toLowerCase().includes(searchTerm) ||
          (app.description || "").toLowerCase().includes(searchTerm) ||
          (app.displayText || "").toLowerCase().includes(searchTerm) ||
          // Buscar en attributeValues de aplicaciones (Modelo, Submodelo, Año, etc.)
          (app.attributeValues || []).some((attr: any) => {
            const value = attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
            return value?.toString().toLowerCase().includes(searchTerm);
          })
        );
      });
      
      return nameMatch || skuMatch || descriptionMatch || attributeMatch || referencesMatch || applicationsMatch;
    });
  }, [searchFilter, mappedData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<Variant>({
    data: searchFilter ? searchFilteredProducts : mappedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mt-6">
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Imagen del Producto</DialogTitle>
            <DialogDescription>
              {selectedVariant && `Sube una nueva imagen para: ${selectedVariant.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <MyDropzone
              file={imageFile}
              fileSetter={setImageFile}
              type="image"
              className="p-8 min-h-[200px]"
              currentImageUrl={getCurrentImageUrl()}
              onImageClick={() => {
                const currentUrl = getCurrentImageUrl();
                if (currentUrl && selectedVariant) {
                  handlePreviewImage(currentUrl, selectedVariant);
                }
              }}
            />
            {(uploading || isUploading) && (
              <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>
            )}
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            {getCurrentImageUrl() && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteImage()}
                disabled={uploading || isUploading}
              >
                Eliminar Imagen
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setImageDialogOpen(false)}
              disabled={uploading || isUploading}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vista Previa de Imagen</DialogTitle>
            {previewVariant && (
              <DialogDescription>
                Producto: {previewVariant.name}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4 flex justify-center">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Vista previa"
                className="max-w-full max-h-[500px] object-contain rounded-lg"
              />
            )}
          </div>
          {previewVariant && previewVariant.id === previewVariant.idProduct && (
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleDeleteImage(previewVariant)}
              >
                Eliminar Imagen
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewDialogOpen(false)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          )}
          {previewVariant && previewVariant.id !== previewVariant.idProduct && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPreviewDialogOpen(false)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Cargando productos...</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No existen resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
