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
        <Navigate to="/productos" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/productos",
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: "/producto/new-product",
    element: (
      <ProtectedRoute>
        <NewProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/producto/importar",
    element: <ImportProduct />,
  },
  {
    path: "/producto/importar/dashboard",
    element: (
      <ProtectedRoute>
        <ImportJobsDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/producto/:id",
    element: (
      <ProtectedRoute>
        <NewProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/marcas",
    element: (
      <ProtectedRoute>
        <Marcas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias",
    element: (
      <ProtectedRoute>
        <Categorias />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias/nueva",
    element: (
      <ProtectedRoute>
        <NewCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias/editar",
    element: (
      <ProtectedRoute>
        <EditCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/boletines",
    element: (
      <ProtectedRoute>
        <TechincalSheets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/noticias",
    element: (
      <ProtectedRoute>
        <News />
      </ProtectedRoute>
    ),
  },
  {
    path: "/noticias/nueva",
    element: (
      <ProtectedRoute>
        <NewBlogPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/noticias/editar",
    element: (
      <ProtectedRoute>
        <EditBlogPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/banners",
    element: (
      <ProtectedRoute>
        <Banners />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ajustes",
    element: (
      <ProtectedRoute>
        <Ajustes />
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
                <DeleteModal />
                <RouterProvider router={router} />
                <Toaster />
                <ImportStatusBanner />
              </ImportProvider>
            </NewsProvider>
          </CategoryContextProvider>
        </BrandProvider>
      </DeleteModalProvider>
    </AuthProvider>
  </React.StrictMode>
);
