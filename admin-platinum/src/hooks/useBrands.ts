import { Brand } from "@/models/brand";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";

export const useBrands = () => {
  const client = axiosClient();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<Brand | null>({} as Brand);
  const [loading, setLoading] = useState<boolean>(false);

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
      console.log(brand);
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
      const data = await client.delete(`/brands/${id}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addBrand = (brand: Brand) => {
    console.log(brand);
  };

  const updateBrand = (brand: Brand) => {
    console.log(brand);
  };

  return {
    brands,
    brand,
    loading,
    getBrandById,
    deleteBrand,
    addBrand,
    updateBrand,
  };
};
