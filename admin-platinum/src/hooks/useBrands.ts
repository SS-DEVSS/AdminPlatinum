import { useAuthContext } from "@/context/auth-context";
import { Brand } from "@/models/brand";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useBrands = () => {
  const { authState } = useAuthContext();
  const client = axiosClient(authState.authKey);
  const { toast } = useToast();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<Brand | null>({} as Brand);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    try {
      setLoading(true);
      const data = await client.get("/brands");
      setBrands(data.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBrandById = async (id: Brand["id"]) => {
    try {
      setLoading(true);
      const data = await client.get(`/brands/${id}`);
      setBrand(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: Brand["id"]) => {
    try {
      setLoading(true);
      const response = await client.delete(`/brands/${id}`);
      toast({
        title: "Marca eliminada correctamente.",
        variant: "success",
        description: response.data.message,
      });
    } catch (error: any) {
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al eliminar marca",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  const addBrand = async (brand: Omit<Brand, "id">) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await client.post("/brands/", brand, { headers });
      toast({
        title: "Marca eliminada correctamente.",
        variant: "success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al eliminar marca",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  const updateBrand = async (brand: Brand) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await client.post("/brands/", brand, { headers });
      toast({
        title: "Marca creada correctamente.",
        variant: "success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al crear marca",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  return {
    brands,
    brand,
    loading,
    getBrands,
    getBrandById,
    deleteBrand,
    addBrand,
    updateBrand,
  };
};
