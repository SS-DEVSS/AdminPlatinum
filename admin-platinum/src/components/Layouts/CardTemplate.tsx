import { Box, ExternalLink, MoreHorizontal, Pencil, Trash } from "lucide-react";
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
import { Link } from "react-router-dom";
import { Brand } from "@/models/brand";
import { useLocation } from "react-router-dom";
import { useDeleteModal } from "@/context/delete-context";
import { useBrandModal } from "@/context/brand-context";
import { useBrands } from "@/hooks/useBrands";
import { Category } from "@/models/category";
import { Separator } from "../ui/separator";

type CardTemplateProps = {
  brands?: Brand[];
  brand?: Brand;
  date?: Date;
  getBrandById?: (id: Brand["id"]) => void;
};

const CardTemplate = ({ brands, brand, getBrandById }: CardTemplateProps) => {
  const { openModal } = useDeleteModal();
  const { openModal: openModalBrand } = useBrandModal();

  const { deleteBrand } = useBrands();

  const location = useLocation();
  const { pathname } = location;

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

  const handleDeleteBrand = () => {
    deleteBrand(brand?.id!);
  };

  const handleEditCategory = () => {
    openModal({
      title: "Borrar Categoría",
      description: "Estas seguro que deseas eliminar esta categoría?",
      pathname: "/categorias",
      handleDelete: handleDeleteCategory,
    });
  };

  const handleDeleteCategory = () => {
    console.log("Deleted category");
  };

  return (
    <>
      <Card className="w-full">
        <img
          src={brand?.logo_img_url}
          alt={`${brand?.name} image`}
          className="h-[300px] object-cover rounded-t-lg bg-[#D9D9D9] mx-auto"
        />
        <CardContent className="border-t">
          <div className="flex justify-between items-center">
            <CardTitle className="mt-6 mb-3">{brand?.name}</CardTitle>
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
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar Categoría</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleEditCategory}>
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
                      onClick={() =>
                        openModal({
                          title: "Borrar Marca",
                          description:
                            "Estas seguro que deseas eliminar esta marca?",
                          handleDelete: handleDeleteBrand,
                        })
                      }
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {brands && (
            <div className="mb-3 rounded-md py-1">
              {brands.map((brand) => (
                <Badge key={brand.id}>{brand.name}</Badge>
              ))}
            </div>
          )}
          <CardDescription className="leading-7">
            {brand?.description}
          </CardDescription>
        </CardContent>
        {brand?.categories?.length! > 0 && (
          <>
            <Separator />
            <CardContent className="mt-3">
              <p className="font-bold mb-4">Categorías Asociadas</p>
              {brand?.categories?.map((category: Category) => (
                <Badge key={category.id} className="px-4 py-1 hover:underline">
                  {category.name} <ExternalLink className="ml-2 w-5" />
                </Badge>
              ))}
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
};

export default CardTemplate;
