import { useAuthContext } from "@/context/auth-context";
import { Category } from "@/models/category";
import axiosClient from "@/services/axiosInstance";
import { useEffect } from "react";
import { useState } from "react";
import { useToast } from "./use-toast";

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
      console.log(data.data);
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

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await client.post("/categories/", category, { headers });
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

  const updateBrand = async (category: Category) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await client.patch(
        `/categories/${category.id}`,
        category,
        {
          headers,
        }
      );
      toast({
        title: "Categoría actualizada correctamente.",
        variant: "success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al actualizar categoría",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  return {
    categories,
    category,
    getCategories,
    getCategoryById,
    deleteCategory,
  };
};
