import { useToast } from "@/hooks/use-toast";
import { Category } from "@/models/category";
import axiosClient from "@/services/axiosInstance";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CategoryRespone {
  id: string;
  message: string;
}

interface ContextCategoryTypes {
  selectedCategory: Category["id"] | null;
  setSelectedCategory: Dispatch<Category["id"] | null>;
  categories: Category[];
  category: Category | null;
  loading: boolean;
  getCategoryById: (id: CategoryRespone["id"]) => void;
  getCategories: () => void;
  addCategory: (
    category: Omit<Category, "id">
  ) => Promise<CategoryRespone | null>;
  deleteCategory: (id: Category["id"]) => void;
}

const CategoryContext = createContext<ContextCategoryTypes>({} as any);

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const client = axiosClient();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<
    Category["id"] | null
  >(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await client.get("/categories");
      console.log("Categories response:", response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Categories response is not an array:", response.data);
        setCategories([]);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setErrorMsg(error.response?.data?.error || "Error al cargar categorías");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id: CategoryRespone["id"]) => {
    try {
      setLoading(true);
      const { data } = await client.get(
        `/categories/${id}?attributes=true&products=true`
      );
      console.log(data);
      setCategory(data);
      return data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
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
      await getCategories();
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
      await getCategories();
      return response.data;
    } catch (error: any) {
      console.log(error.response.data.error);
      toast({
        title: "Error al crear categoría",
        variant: "destructive",
        description: error.response.data.error,
      });
      return null;
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        loading,
        selectedCategory,
        setSelectedCategory,
        category,
        categories,
        getCategoryById,
        getCategories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
