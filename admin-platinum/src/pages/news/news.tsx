import { Search } from "lucide-react";

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

const News = () => {
  const { blogPosts } = useNews();

  const filteredBlogPosts = [];

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
          </div>
        </CardHeader>
        <CardSectionLayout>
          {blogPosts.length === 0 && filteredBlogPosts.length === 0 ? (
            <p>No hay marcas disponibles.</p>
          ) : (
            (filteredBlogPosts.length > 0 ? filteredBlogPosts : blogPosts).map(
              (blogPost: BlogPost) => blogPost.title
              // <CardTemplate
              //   key={brand.id}
              //   brand={brand}
              //   getBrandById={getBrandById}
              //   getItems={getBrands}
              // />
            )
          )}
        </CardSectionLayout>
      </Card>
    </Layout>
  );
};

export default News;
