import {
  Box,
  ExternalLink,
  EyeIcon,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "@/models/brand";
import { useLocation } from "react-router-dom";
import { useDeleteModal } from "@/context/delete-context";
import { useBrandContext } from "@/context/brand-context";
import { useBrands } from "@/hooks/useBrands";
import { Category } from "@/models/category";
import { Separator } from "../ui/separator";
import { cleanFilePath } from "@/services/S3FileManager";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useS3FileManager } from "@/hooks/useS3FileManager";

type CardTemplateProps = {
  category?: Category;
  brand?: Brand;
  date?: Date;
  getItems?: () => void;
  getBrandById?: (id: Brand["id"]) => void;
  deleteCategory?: any;
  getCategoryById?: any;
};

const CardTemplate = ({
  brand,
  category,
  getBrandById,
  deleteCategory,
  getCategoryById,
}: CardTemplateProps) => {
  const { openModal } = useDeleteModal();
  const { setSelectedBrand, openModal: openModalBrand } = useBrandContext();
  const { deleteBrand } = useBrands();
  const { deleteFile } = useS3FileManager();
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const viewCategoriesFromBrand = (id: Brand["id"]) => {
    setSelectedBrand(id);
    navigate("/categorias");
  };

  const navigateCreateCategory = (id: Brand["id"]) => {
    setSelectedBrand(id);
    navigate("/categorias/nueva");
  };

  const handleEditBrand = () => {
    if (getBrandById) {
      getBrandById(brand?.id!);
      openModalBrand({
        title: "Editar Marca",
        description: "Edita una marca existente.",
        action: "",
      });
    }
  };

  const handleDeleteBrand = async () => {
    deleteFile(cleanFilePath(brand!.logoImgUrl, 61), async () => {
      await deleteBrand(brand?.id!);
    });
  };

  const handleEditCategory = async (id: Category["id"]) => {
    await getCategoryById(id);
  };

  const handleDeleteCategory = async () => {
    deleteFile(cleanFilePath(category!.imgUrl, 61), async () => {
      await deleteCategory(category?.id!);
    });
  };

  const getImageUrl = () => {
    if (brand) {
      if (brand.logoImgUrl) {
        return `${import.meta.env.VITE_AWS_S3_BUCKET_PUBLIC_URL}${cleanFilePath(
          brand.logoImgUrl,
          76
        )}`;
      }
    } else if (category) {
      if (category.imgUrl) {
        return `${import.meta.env.VITE_AWS_S3_BUCKET_PUBLIC_URL}${cleanFilePath(
          category.imgUrl,
          76
        )}`;
      }
    }
    return null;
  };

  const renderImage = () => {
    const imageUrl = getImageUrl();

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
          alt={`${brand ? brand?.name : category?.name} image`}
          className="h-[300px] w-full object-cover rounded-t-lg bg-[#D9D9D9] mx-auto"
        />
      );
    }

    // Fallback SVG placeholder
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-200 rounded-t-lg mx-auto">
        <svg
          className="w-20 h-20 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full">
        {renderImage()}
        <div className="hidden h-[300px] w-full flex items-center justify-center bg-gray-200 rounded-t-lg mx-auto">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <CardContent className="border-t">
          <div className="flex justify-between items-center">
            <CardTitle className="mt-6 mb-3">
              {brand ? brand?.name : category?.name}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="hover:cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pathname === "/categorias" && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Box className="mr-2 h-4 w-4" />
                      <span>Consultar Productos</span>
                    </DropdownMenuItem>
                    <Link to="/categorias/editar">
                      <DropdownMenuItem
                        onClick={() => handleEditCategory(category?.id)}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        <span>Ver Categoría</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => {
                        if (category?.products?.length) {
                          toast({
                            title:
                              "Elimina todos los productos asociados a la categoría.",
                            variant: "destructive",
                          });
                          return;
                        }
                        openModal({
                          title: "Categoría",
                          description: "Estas seguro que deseas eliminar esta?",
                          handleDelete: handleDeleteCategory,
                        });
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
                {pathname === "/marcas" && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleEditBrand}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar Marca</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (brand?.categories?.length) {
                          toast({
                            title:
                              "Elimina todas las categorías asociadas a la marca.",
                            variant: "destructive",
                          });
                          return;
                        }
                        openModal({
                          title: "Marca",
                          description:
                            "Estas seguro que deseas eliminar esta marca?",
                          handleDelete: handleDeleteBrand,
                        });
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="leading-7">
            {brand ? brand?.description : category?.description}
          </CardDescription>
        </CardContent>
        {category && category!.brands && (
          <section>
            <Separator />
            <CardContent className="mt-4">
              <p className="font-bold">Marcas Asociadas</p>
              <div className="rounded-md my-3 py-1">
                {category!.brands.map((brand: any) => (
                  <Badge className="mr-3" key={brand!.id}>
                    {brand!.name}
                  </Badge>
                ))}
              </div>
              <p className="font-medium text-sm text-slate-400">
                {category.products?.length} productos asociados a la categoría.
              </p>
            </CardContent>
          </section>
        )}
        {brand?.categories?.length! > 0 && (
          <>
            <Separator />
            <CardContent className="mt-3">
              <p className="font-bold mb-4">Categorías Asociadas</p>
              <section className="flex flex-wrap gap-2"></section>
              {brand?.categories?.map((category: Category) => (
                <Badge
                  key={category.id}
                  onClick={() => viewCategoriesFromBrand(brand.id)}
                  className="px-4 py-1 mr-3 hover:underline hover:cursor-pointer"
                >
                  {category.name} <ExternalLink className="ml-2 w-5" />
                </Badge>
              ))}
            </CardContent>
          </>
        )}
        {brand && (
          <CardContent>
            <Button
              variant="outline"
              onClick={() => navigateCreateCategory(brand.id)}
              className="rounded-full flex gap-2"
            >
              Agregar Categoría <PlusCircle />
            </Button>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default CardTemplate;
