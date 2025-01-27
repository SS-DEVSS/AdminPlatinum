import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DeleteModal from "./components/DeleteModal";
import { DeleteModalProvider } from "./context/delete-context";
import "./index.css";
import Categorias from "@/pages/categories/categories";
import EditCategory from "@/pages/categories/editCategory";
import NewCategory from "@/pages/categories/newCategory";
import ForgotPassword from "@/pages/auth/forgotPassword";
import Login from "@/pages/auth/login";
import Marcas from "@/pages/marcas";
import { BrandProvider } from "./context/brand-context";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";
import TechincalSheets from "@/pages/techincalSheets";
import News from "@/pages/news/news";
import NewBlogPost from "@/pages/news/newBlogPost";
import EditBlogPost from "@/pages/news/editBlogPost";
import { NewsProvider } from "./context/news-context";
import Banners from "@/pages/banners";
import Products from "@/pages/products/products";
import { CategoryContextProvider } from "./context/categories-context";
import NewProduct from "./pages/products/newProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/olvide-mi-contrasena",
    element: <ForgotPassword />,
  },
  {
    path: "/productos",
    element: <Products />,
  },
  {
    path: "/producto/new-product",
    element: <NewProduct />,
  },
  {
    path: "/marcas",
    element: <Marcas />,
  },
  {
    path: "/categorias",
    element: <Categorias />,
  },
  {
    path: "/categorias/nueva",
    element: <NewCategory />,
  },
  {
    path: "/categorias/editar",
    element: <EditCategory />,
  },
  {
    path: "/boletines",
    element: <TechincalSheets />,
  },
  {
    path: "/noticias",
    element: <News />,
  },
  {
    path: "/noticias/nueva",
    element: <NewBlogPost />,
  },
  {
    path: "/noticias/editar",
    element: <EditBlogPost />,
  },
  {
    path: "/banners",
    element: <Banners />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <DeleteModalProvider>
        <BrandProvider>
          <CategoryContextProvider>
            <NewsProvider>
              <DeleteModal />

              <RouterProvider router={router} />
              <Toaster />
            </NewsProvider>
          </CategoryContextProvider>
        </BrandProvider>
      </DeleteModalProvider>
    </AuthProvider>
  </React.StrictMode>
);
