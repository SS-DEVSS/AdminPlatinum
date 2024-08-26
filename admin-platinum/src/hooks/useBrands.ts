import { Brand } from "@/models/brand";
import { brandsSample } from "@/sampleData/brands";
import { useEffect, useState } from "react";

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addBrand = (brand: Brand) => {};
  const updateBrand = (brand: Brand) => {};

  useEffect(() => {
    setBrands(brandsSample);
  }, []);

  return { brands, loading, error, addBrand, updateBrand };
};
