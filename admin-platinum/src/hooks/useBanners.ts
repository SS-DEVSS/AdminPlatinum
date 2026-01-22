import { Banner } from "@/models/banner";
import axiosClient from "@/services/axiosInstance";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "./use-toast";

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true); // Start with true to show loader initially
  const [errorMsg, setErrorMsg] = useState("");

  const client = axiosClient();

  useEffect(() => {
    getAllBanners();
  }, []);

  const getAllBanners = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/banners?page=1&pageSize=10`);
      setBanners(data.banners);
    } catch (error: any) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const addBanner = async (path: string) => {
    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await client.post(
        `/banners/`,
        { desktopPath: path },
        { headers }
      );
      toast({
        title: "Banner agregado correctamente.",
        variant: "success",
        description: response.data.message,
      });
      await getAllBanners();
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error);
      toast({
        title: "Error al crear banner",
        variant: "destructive",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: Banner["id"]) => {
    try {
      setLoading(true);
      const response = await client.delete(`/banners/${id}`);
      toast({
        title: "Banner eliminado correctamente.",
        variant: "success",
        description: response.data.message,
      });
      await getAllBanners();
    } catch (error: any) {
      console.log(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, banners, addBanner, deleteBanner };
};
