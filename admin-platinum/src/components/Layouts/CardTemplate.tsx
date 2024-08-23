import { Box, MoreHorizontal, Pencil, Trash } from "lucide-react";
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

type CardTemplateProps = {
  image: string;
  title: string;
  description: string;
  brands?: Brand[];
  brand?: Brand;
  date?: Date;
};

const CardTemplate = ({
  image,
  title,
  description,
  brands,
}: // brand,
CardTemplateProps) => {
  const { openModal } = useDeleteModal();
  const { openModal: openModalBrand } = useBrandModal();
  const location = useLocation();
  const { pathname } = location;

  const handleDeleteBrand = () => {
    console.log("Deleted brand");
  };

  const handleDeleteCategory = () => {
    console.log("Deleted category");
  };

  return (
    <>
      <Card className="w-full">
        <img
          src={image}
          alt="name"
          className="h-[300px] object-cover rounded-t-lg bg-[#D9D9D9] mx-auto"
        />
        <CardContent className="border-t">
          <div className="flex justify-between items-center">
            <CardTitle className="mt-6 mb-3">{title}</CardTitle>
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
                      <DropdownMenuItem onClick={() => openModalBrand}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar Categoría</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() =>
                        openModal({
                          title: "Borrar Categoría",
                          description:
                            "Estas seguro que deseas eliminar esta categoría?",
                          pathname: "/categorias",
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
                    <DropdownMenuItem onClick={openModalBrand}>
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
          <CardDescription className="leading-7">{description}</CardDescription>
        </CardContent>
      </Card>
    </>
  );
};

export default CardTemplate;
