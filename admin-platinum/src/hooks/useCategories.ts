import { useAuthContext } from "@/context/auth-context";
import { Category } from "@/models/category";
import axiosClient from "@/services/axiosInstance";
import { useEffect } from "react";
import { useState } from "react";
import { useToast } from "./use-toast";

interface CategoryRespone {
  id: string;
  message: string;
}

export const useCategories = () => {
  const { authState } = useAuthContext();
  const client = axiosClient(authState.authKey);
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>({} as Category);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      const data = await client.get("/categories");
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id: Category["id"]) => {
    try {
      setLoading(true);
      const data = await client.get(`/categories/${id}`);
      setCategory(data.data);
      console.log(data);
      return data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: Category["id"]) => {
    try {
      setLoading(true);
      const response = await client.delete(`/categories/${id}`);
      toast({
        title: "Categoría eliminada correctamente.",
        variant: "success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al eliminar categoría",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  const addCategory = async (
    category: Omit<Category, "id">
  ): Promise<CategoryRespone | null> => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await client.post<CategoryRespone>(
        "/categories/",
        category,
        { headers }
      );
      toast({
        title: "Categoría agregada correctamente.",
        variant: "success",
        description: response.data.message,
      });
      return response.data;
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al crear categoría",
        variant: "destructive",
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  //   const updateCategory= async (category: Category) => {
  //     try {
  //       const headers = {
  //         "Content-Type": "application/json",
  //       };
  //       setLoading(true);
  //       const response = await client.patch(
  //         `/categories/${category.id}`,
  //         category,
  //         {
  //           headers,
  //         }
  //       );
  //       toast({
  //         title: "Categoría actualizada correctamente.",
  //         variant: "success",
  //         description: response.data.message,
  //       });
  //     } catch (error: any) {
  //       console.log(error);
  //       setErrorMsg(error.response.data.error);
  //       toast({
  //         title: "Error al actualizar categoría",
  //         variant: "destructive",
  //         description: errorMsg,
  //       });
  //     } finally {
  //       setLoading(false);
  //       setErrorMsg("");
  //     }
  //   };

  return {
    loading,
    categories,
    category,
    getCategories,
    getCategoryById,
    deleteCategory,
    addCategory,
  };
};
