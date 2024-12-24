import { useAuthContext } from "@/context/auth-context";
import { TechnicalSheet } from "@/models/technicalSheet";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useTs = () => {
  const { authState } = useAuthContext();
  const client = axiosClient(authState.authKey);
  const { toast } = useToast();

  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheet[]>([]);
  //   const [brand, setBrand] = useState<Brand | null>({} as Brand);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getTechnicalSheets();
  }, []);

  const getTechnicalSheets = async (): Promise<TechnicalSheet[] | null> => {
    try {
      setLoading(true);
      const data = await client.get("/ts?page=1&pageSize=10");
      setTechnicalSheets(data.data.technicalSheets);
      return data.data.technicalSheets;
    } catch (error) {
      console.error("Error fetching technical sheets:", error);
      return null;
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
    technicalSheets,
    // brand,
    loading,
    getTechnicalSheets,
    // getBrandById,
    // deleteBrand,
    // addBrand,
    // updateBrand,
  };
};
