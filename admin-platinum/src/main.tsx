import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import Categorias from "./pages/categories/categories";
import EditCategory from "./pages/categories/editCategory";
import NewCategory from "./pages/categories/newCategory";
import Login from "./pages/login";
import Marcas from "./pages/marcas";
import Root from "./pages/root";

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
    <RouterProvider router={router} />
  </React.StrictMode>
);
