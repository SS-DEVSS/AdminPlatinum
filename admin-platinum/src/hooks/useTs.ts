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

  const addTechnicalSheet = async (ts: Omit<TechnicalSheet, "id">) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      setLoading(true);
      await client.post("/ts/", ts, { headers });
      await getTechnicalSheets();
      toast({
        title: "Boletín creado correctamente.",
        variant: "success",
      });
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al crear boletín",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

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

  const deleteTechnicalSheet = async (id: TechnicalSheet["id"]) => {
    try {
      setLoading(true);
      await client.delete(`/ts/${id}`);
      await getTechnicalSheets();
      toast({
        title: "Boletín eliminado correctamente.",
        variant: "success",
      });
    } catch (error: any) {
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al eliminar boletín",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

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
    addTechnicalSheet,
    getTechnicalSheets,
    // getBrandById,
    // updateBrand,
    deleteTechnicalSheet,
  };
};
