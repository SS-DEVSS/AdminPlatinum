import { PlusCircle, Search } from "lucide-react";

import Layout from "@/components/Layouts/Layout";
import CardSectionLayout from "@/components/Layouts/CardSectionLayout";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNews } from "@/hooks/useNews";
import { BlogPost } from "@/models/news";
import CardBlogPost from "@/components/CardBlogPost";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const News = () => {
  const { blogPosts, deleteBlogPost } = useNews();

  const filteredBlogPosts: BlogPost[] = [];

  return (
    <Layout>
      <Card className="border-0 shadow-none">
        <CardHeader className="flex flex-row p-0 m-0">
          <div className="flex flex-col gap-3">
            <CardTitle>Noticias</CardTitle>
            <CardDescription>
              Maneja tus noticias creadas en la aplicación
            </CardDescription>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar Noticia..."
                // onChange={handleSearchFilter}
                // value={filterBrandSearch}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Link to="/noticias/nueva">
              <Button
                size="sm"
                className="h-10 px-6 gap-1"
                // onClick={() => handleOpenModal()}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-2" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Agregar Noticia
                </span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardSectionLayout>
          {blogPosts.length === 0 && filteredBlogPosts.length === 0 ? (
            <p>No hay noticias disponibles.</p>
          ) : (
            (filteredBlogPosts.length > 0 ? filteredBlogPosts : blogPosts).map(
              (blogPost: BlogPost) => (
                <CardBlogPost
                  key={blogPost.id}
                  blogPost={blogPost}
                  deleteItem={deleteBlogPost}
                />
              )
            )
          )}
        </CardSectionLayout>
      </Card>
    </Layout>
  );
};

export default News;
