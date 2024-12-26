import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";

import { useMemo, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import { ChevronDown, ChevronLeft, PlusCircle, SquarePlus } from "lucide-react";
import { BlogPost } from "@/models/news";
import { useNews } from "@/hooks/useNews";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import NewsComponent from "@/components/NewsComponent";

type BlogPostCUProps = {
  blogPost?: BlogPost;
};

interface FormTypes {
  title: string;
  description: string;
  coverImagePath: string;
  content: string;
}
const FormInitialState = {
  title: "",
  description: "",
  coverImagePath: "",
  content: "<p>Test</p>",
};

enum ComponentTypes {
  TITLE = "h1",
  SUBTITLE = "h3",
  PARAGRAPH = "p",
  IMAGE = "img",
}

export interface Component {
  id?: string;
  type: ComponentTypes;
  title: string;
  content: string;
}

const BlogPostCU = ({ blogPost }: BlogPostCUProps) => {
  const { addBlogPost } = useNews();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormTypes>(FormInitialState);
  const [component, setComponent] = useState<Component>({} as Component);
  const [components, setComponents] = useState<Component[]>([]);

  const handleFormInput = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const convertContentToString = () => {
    components.forEach((component) => {
      setForm({
        ...form,
        content: `${form.content}<${component.type}>${component.content}</${component.type}>`,
      });
    });
  };

  const validateForm = useMemo(
    () =>
      form.title.trim() !== "" &&
      form.description.trim() !== "" &&
      form.content.trim() !== "",
    [form]
  );

  const handleSubmit = async (form: FormTypes) => {
    convertContentToString();
    await addBlogPost(form);
    navigate("/noticias");
  };

  console.log(form);

  const returnComponent = async (selectedComponent: ComponentTypes) => {
    let type: ComponentTypes = "";
    let title = "";
    switch (selectedComponent) {
      case "h1":
        type = ComponentTypes.TITLE;
        title = "Título";
      case "h3":
        type = ComponentTypes.SUBTITLE;
        title = "Sub Título";
      case "p":
        type = ComponentTypes.PARAGRAPH;
        title = "Párrafo";
    }
    console.log(type);
    await setComponent({
      id: uuidv4(),
      type,
      title,
      content: "",
    });
    await setComponents([...components, component]);
  };

  console.log(component);
  console.log(components);

  return (
    <Layout>
      <section className="max-w-[1000px] mx-auto">
        <header className="flex justify-between">
          <div className="flex items-center gap-4">
            <Link to="/noticias">
              <Card className="p-2">
                <ChevronLeft className="h-4 w-4" />
              </Card>
            </Link>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {blogPost ? `${blogPost.title}` : "Nueva Noticia"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/noticias">
              <Button variant={"outline"}>Cancelar</Button>
            </Link>
            {!blogPost ? (
              <Button
                size="sm"
                disabled={!validateForm}
                className="h-10 px-6 gap-1"
                onClick={() => handleSubmit(form)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-2" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Agregar Noticia
                </span>
              </Button>
            ) : (
              <Button disabled size="sm" className="h-10 px-6 gap-1">
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Actualizar Noticia
                </span>
              </Button>
            )}
          </div>
        </header>
        <Card x-chunk="dashboard-07-chunk-0" className="mt-4">
          <CardHeader>
            <CardTitle>Detalles de la Noticia</CardTitle>
            <CardDescription>
              Ingrese los detalles de la noticia que desea crear.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">
                  <span className="text-redLabel">*</span>Título
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full"
                  placeholder="Gamer Gear Pro Controller"
                  value={blogPost ? blogPost.title : form.title}
                  onChange={handleFormInput}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">
                  <span className="text-redLabel">*</span>Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Lorem ipsum dolor sit amet."
                  value={blogPost ? blogPost.description : form.description}
                  onChange={handleFormInput}
                  className="min-h-20"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="coverImagePath">Imagen de portada</Label>
                <Input
                  id="coverImagePath"
                  name="coverImagePath"
                  type="text"
                  placeholder="https://"
                  className="w-full"
                  value={
                    blogPost ? blogPost.coverImagePath : form.coverImagePath
                  }
                  onChange={handleFormInput}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-07-chunk-0" className="mt-4">
          <CardHeader>
            <CardTitle>Contenido de la Noticia</CardTitle>
            <CardDescription>
              Use los bloques para crear el contenido de su noticia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {components &&
                components.map((component: Component) => (
                  <NewsComponent
                    component={component}
                    components={components}
                    setComponents={setComponents}
                  />
                ))}
            </div>
            <div className="border border-dashed rounded-lg mt-3 p-4 px-6 flex justify-between">
              <div className="flex items-center gap-3">
                <SquarePlus className="w-8 h-8 fill-slate-400 text-white" />
                <p className="text-[#94A3B8]">Agregar Bloque</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ChevronDown className="w-6 h-6 text-slate-400 hover:outline-none" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Elige el componente deseado
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => returnComponent(ComponentTypes.TITLE)}
                  >
                    Título
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => returnComponent(ComponentTypes.SUBTITLE)}
                  >
                    Sub título
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => returnComponent(ComponentTypes.PARAGRAPH)}
                  >
                    Párrafo
                  </DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default BlogPostCU;
