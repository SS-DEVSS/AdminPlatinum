import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
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
import { useDeleteModal } from "@/context/delete-context";
import { BlogPost } from "@/models/news";
import { newsContext } from "@/context/news-context";
import { useS3FileManager } from "@/hooks/useS3FileManager";

type CardTemplateProps = {
  blogPost?: BlogPost;
  getItems?: () => void;
  deleteItem?: (id: BlogPost["id"]) => void;
};

const CardBlogPost = ({ blogPost, deleteItem }: CardTemplateProps) => {
  const { openModal } = useDeleteModal();
  const { getBlogPostById } = newsContext();
  const { deleteFile } = useS3FileManager();

  const handleEditBlogPost = async (id: BlogPost["id"]) => {
    await getBlogPostById(id);
  };

  const handleDeleteBlogPost = () => {
    if (deleteItem) {
      deleteFile(blogPost?.coverImagePath, () => {
        deleteItem(blogPost?.id!);
      });
    }
  };

  return (
    <>
      <Card className="w-full">
        <img
          src={blogPost!.coverImagePath}
          alt={`${blogPost?.title} image`}
          className="h-[300px] object-cover rounded-t-lg bg-[#D9D9D9] mx-auto"
        />
        <CardContent className="border-t">
          <div className="flex justify-between items-center">
            <CardTitle className="mt-6 mb-3">{blogPost?.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="hover:cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link to="/noticias/editar">
                    <DropdownMenuItem
                      onClick={() => handleEditBlogPost(blogPost?.id!)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar Noticia</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() =>
                      openModal({
                        title: "Noticia",
                        description:
                          "Estas seguro que deseas eliminar esta noticia?",
                        handleDelete: handleDeleteBlogPost,
                      })
                    }
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Eliminar Noticia</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="leading-7">
            {blogPost?.description}
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
};

export default CardBlogPost;
