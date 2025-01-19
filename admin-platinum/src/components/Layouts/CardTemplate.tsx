import {
  Box,
  ExternalLink,
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
import { useCategoryContext } from "@/context/categories-context";

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
  const { setSelectedCategory } = useCategoryContext();

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
    // const data = await getCategoryById("bd3dcd72-961a-49fc-ab5d-21a2243c1c44");
    // console.log("Direct Data Returned:", data);
  };

  const handleDeleteCategory = async () => {
    await deleteCategory(category?.id!);
    // await getItems();
  };

  return (
    <>
      <Card className="w-full">
        <img
          src={`${import.meta.env.VITE_AWS_S3_BUCKET_PUBLIC_URL}${
            brand ? cleanFilePath(brand?.logoImgUrl, 76) : category?.imgUrl
          }`}
          alt={`${brand ? brand?.name : category?.name} image`}
          className="h-[300px] w-full object-cover rounded-t-lg bg-[#D9D9D9] mx-auto"
        />
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
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar Categoría</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() =>
                        openModal({
                          title: "Categoría",
                          description: "Estas seguro que deseas eliminar esta?",
                          handleDelete: handleDeleteCategory,
                        })
                      }
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
          {category && category!.brands && (
            <div className="mb-3 rounded-md py-1">
              {category!.brands.map((brand: any) => (
                <Badge key={brand!.id}>{brand!.name}</Badge>
              ))}
            </div>
          )}

          <CardDescription className="leading-7">
            {brand ? brand?.description : category?.description}
          </CardDescription>
        </CardContent>
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
            <Button variant="outline" className="rounded-full flex gap-2">
              Agregar Categoría <PlusCircle />
            </Button>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default CardTemplate;
