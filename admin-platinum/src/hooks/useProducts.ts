import { Item } from "@/models/product";
import axiosClient from "@/services/axiosInstance";
import { useAuthContext } from "@/context/auth-context";
// import { productsSample } from "@/sampleData/products";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const { authState } = useAuthContext();
  const client = axiosClient(authState.authKey);

  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(
        `/products?type=all&page=1&pageSize=10`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (id: Item["id"]) => {
    console.log(id);
  };
  const handleUpdateProduct = () => {};

  return {
    loading,
    products,
    deleteProduct,
    handleUpdateProduct,
  };
};
