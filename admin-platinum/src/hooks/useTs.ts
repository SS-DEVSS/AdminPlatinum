import { TechnicalSheet } from "@/models/technicalSheet";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useTs = () => {
  const client = axiosClient();
  const { toast } = useToast();

  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheet[]>([]);
  const [technicalSheet, setTechnicalSheet] = useState<TechnicalSheet | null>(
    {} as TechnicalSheet
  );
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

  const getTsById = async (
    id: TechnicalSheet["id"]
  ): Promise<TechnicalSheet | null> => {
    try {
      setLoading(true);
      const data = await client.get(`/ts/${id}`);
      setTechnicalSheet(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching technicalsheet:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

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

  //   const updateTechnicalSheet = async (ts: TechnicalSheet) => {
  //     try {
  //       const headers = {
  //         "Content-Type": "application/json",
  //       };
  //       setLoading(true);
  //       await client.patch(`/ts/${ts.id}`, ts, {
  //         headers,
  //       });
  //       toast({
  //         title: "Boletín actualizado correctamente.",
  //         variant: "success",
  //       });
  //     } catch (error: any) {
  //       console.log(error);
  //       setErrorMsg(error.response.data.error);
  //       toast({
  //         title: "Error al actualizar boletín",
  //         variant: "destructive",
  //         description: errorMsg,
  //       });
  //     } finally {
  //       setLoading(false);
  //       setErrorMsg("");
  //     }
  //   };

  return {
    technicalSheet,
    technicalSheets,
    loading,
    addTechnicalSheet,
    getTechnicalSheets,
    getTsById,
    // updateTechnicalSheet,
    deleteTechnicalSheet,
  };
};
