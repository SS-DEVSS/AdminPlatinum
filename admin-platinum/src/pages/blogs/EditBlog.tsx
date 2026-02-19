import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { newsContext } from "@/context/news-context";
import MarkdownEditor from "@/components/blogs/MarkdownEditor";
import { useToast } from "@/hooks/use-toast";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { blogPost, getBlogPostById } = newsContext();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/blogs", { replace: true });
      return;
    }
    getBlogPostById(id).finally(() => setLoading(false));
  }, [id, getBlogPostById, navigate]);

  useEffect(() => {
    if (blogPost) {
      setTitle(blogPost.title ?? "");
      setDescription(blogPost.description ?? "");
      setContent(blogPost.content ?? "");
    }
  }, [blogPost]);

  const handleSave = () => {
    toast({
      title: "Edición de blogs",
      description: "La actualización de blogs estará disponible cuando el backend lo soporte.",
      variant: "default",
    });
  };

  if (loading || !blogPost) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full flex justify-center px-4">
        <Card className="max-w-4xl w-full">
        <CardHeader className="flex flex-row flex-wrap items-center gap-4">
          <Link
            to="/dashboard/blogs"
            className="rounded-lg p-2 border hover:bg-muted inline-flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <CardTitle>Editar blog</CardTitle>
            <CardDescription>
              El contenido se guarda en Markdown. Vista previa y Markdown debajo.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del blog"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción"
                maxLength={526}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagen de portada</Label>
            {blogPost?.coverImagePath && (
              <img
                src={blogPost.coverImagePath}
                alt="Portada"
                className="rounded-lg border max-h-40 object-cover"
              />
            )}
            <p className="text-xs text-muted-foreground">
              Cambiar imagen de portada estará disponible próximamente.
            </p>
          </div>

          <MarkdownEditor
            label="Contenido del blog"
            value={content}
            onChange={setContent}
            minHeight="280px"
          />

          <div className="flex gap-3 pt-4">
            <Link to="/dashboard/blogs">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="button" onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
};

export default EditBlog;
