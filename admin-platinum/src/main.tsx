import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";
import { DeleteModalProvider } from "./context/delete-context";
import "./index.css";
import Categorias from "@/pages/categories/categories";
import EditCategory from "@/pages/categories/editCategory";
import NewCategory from "@/pages/categories/newCategory";
import ForgotPassword from "@/pages/auth/forgotPassword";
import Login from "@/pages/auth/login";
import ResetPassword from "@/pages/auth/resetPassword";
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
import { ImportProvider } from "./context/import-context";
import NewProduct from "./pages/products/newProduct";
import ImportProduct from "./pages/products/importProduct";
import ImportJobsDashboardPage from "./pages/products/importJobsDashboard";
import Ajustes from "./pages/ajustes";
import ProtectedRoute from "./components/ProtectedRoute";
import { ImportStatusBanner } from "./components/ImportStatusBanner";
import { App } from "./components/App";
import FileManager from "./pages/files/fileManager";
import { FilesProvider } from "./context/files-context";
import FeaturedProducts from "./pages/products/featuredProducts";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/olvide-mi-contrasena",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard/productos" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/productos",
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/producto/new-product",
    element: (
      <ProtectedRoute>
        <NewProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/producto/importar",
    element: <ImportProduct />,
  },
  {
    path: "/dashboard/importaciones",
    element: (
      <ProtectedRoute>
        <ImportJobsDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/producto/:id",
    element: (
      <ProtectedRoute>
        <NewProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/marcas",
    element: (
      <ProtectedRoute>
        <Marcas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/categorias",
    element: (
      <ProtectedRoute>
        <Categorias />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/categorias/nueva",
    element: (
      <ProtectedRoute>
        <NewCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/categorias/editar",
    element: (
      <ProtectedRoute>
        <EditCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/boletines",
    element: (
      <ProtectedRoute>
        <TechincalSheets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/noticias",
    element: (
      <ProtectedRoute>
        <News />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/noticias/nueva",
    element: (
      <ProtectedRoute>
        <NewBlogPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/noticias/editar",
    element: (
      <ProtectedRoute>
        <EditBlogPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/banners",
    element: (
      <ProtectedRoute>
        <Banners />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/ajustes",
    element: (
      <ProtectedRoute>
        <Ajustes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/archivos",
    element: (
      <ProtectedRoute>
        <FileManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/productos-destacados",
    element: (
      <ProtectedRoute>
        <FeaturedProducts />
      </ProtectedRoute>
    ),
  },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <DeleteModalProvider>
        <BrandProvider>
          <CategoryContextProvider>
            <NewsProvider>
              <ImportProvider>
                <FilesProvider>
                  <DeleteModal />
                  <RouterProvider router={router} />
                  <Toaster />
                  <ImportStatusBanner />
                </FilesProvider>
              </ImportProvider>
            </NewsProvider>
          </CategoryContextProvider>
        </BrandProvider>
      </DeleteModalProvider>
    </AuthProvider>
  </React.StrictMode>
);
