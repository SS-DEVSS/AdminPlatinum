import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DeleteModal from "./components/DeleteModal";
import { DeleteModalProvider } from "./context/delete-context";
import "./index.css";
import Categorias from "./pages/categories/categories";
import EditCategory from "./pages/categories/editCategory";
import NewCategory from "./pages/categories/newCategory";
import ForgotPassword from "./pages/auth/forgotPassword";
import Login from "./pages/auth/login";
import Marcas from "./pages/marcas";
import Root from "./pages/root";
import { BrandProvider } from "./context/brand-context";
import { AuthProvider } from "./context/auth-context";

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
    element: <Root />,
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <DeleteModalProvider>
        <BrandProvider>
          <DeleteModal />
          <RouterProvider router={router} />
        </BrandProvider>
      </DeleteModalProvider>
    </AuthProvider>
  </React.StrictMode>
);
