import { useAuthContext } from "@/context/auth-context";
import { BlogPost } from "@/models/news";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useNews = () => {
  const { authState } = useAuthContext();
  const client = axiosClient(authState.authKey);
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsItem, setBrand] = useState<BlogPost | null>({} as BlogPost);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getBlogPosts();
  }, []);

  const getBlogPosts = async () => {
    try {
      setLoading(true);
      const data = await client.get("/blog/posts");
      setBlogPosts(data.data.blogPosts);
      console.log(data.data.blogPosts);
    } catch (error) {
      console.error("Error fetching blogPosts:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const getBrandById = async (id: Brand["id"]) => {
  //     try {
  //       setLoading(true);
  //       const data = await client.get(`/brands/${id}`);
  //       setBrand(data.data);
  //       return data.data;
  //     } catch (error) {
  //       console.error("Error fetching brands:", error);
  //     } finally {
  //       console.log(brand);
  //       setLoading(false);
  //     }
  //   };

  //   const deleteBrand = async (id: Brand["id"]) => {
  //     try {
  //       setLoading(true);
  //       const response = await client.delete(`/brands/${id}`);
  //       toast({
  //         title: "Marca eliminada correctamente.",
  //         variant: "success",
  //         description: response.data.message,
  //       });
  //     } catch (error: any) {
  //       setErrorMsg(error.response.data.error);
  //       toast({
  //         title: "Error al eliminar marca",
  //         variant: "destructive",
  //         description: errorMsg,
  //       });
  //     } finally {
  //       setLoading(false);
  //       setErrorMsg("");
  //     }
  //   };

  //   const addBrand = async (brand: Omit<Brand, "id">) => {
  //     try {
  //       const headers = {
  //         "Content-Type": "application/json",
  //       };
  //       setLoading(true);
  //       const response = await client.post("/brands/", brand, { headers });
  //       toast({
  //         title: "Marca eliminada correctamente.",
  //         variant: "success",
  //         description: response.data.message,
  //       });
  //     } catch (error: any) {
  //       console.log(error);
  //       setErrorMsg(error.response.data.error);
  //       toast({
  //         title: "Error al eliminar marca",
  //         variant: "destructive",
  //         description: errorMsg,
  //       });
  //     } finally {
  //       setLoading(false);
  //       setErrorMsg("");
  //     }
  //   };

  //   const updateBrand = async (brand: Brand) => {
  //     try {
  //       const headers = {
  //         "Content-Type": "application/json",
  //       };
  //       setLoading(true);
  //       const response = await client.patch(`/brands/${brand.id}`, brand, {
  //         headers,
  //       });
  //       toast({
  //         title: "Marca actualizada correctamente.",
  //         variant: "success",
  //         description: response.data.message,
  //       });
  //     } catch (error: any) {
  //       console.log(error);
  //       setErrorMsg(error.response.data.error);
  //       toast({
  //         title: "Error al actualizar marca",
  //         variant: "destructive",
  //         description: errorMsg,
  //       });
  //     } finally {
  //       setLoading(false);
  //       setErrorMsg("");
  //     }
  //   };

  return {
    //   brand,
    blogPosts,
    // loading,
    getBlogPosts,
    // getBrandById,
    // deleteBrand,
    // addBrand,
    // updateBrand,
  };
};
