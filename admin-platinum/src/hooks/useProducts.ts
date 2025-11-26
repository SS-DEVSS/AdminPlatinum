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
      const firstPage = await client.get(`/products?type=all&page=1&pageSize=100`);
      
      const { totalPages, products: firstPageProducts } = firstPage.data;
      let allProducts = [...firstPageProducts];

      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          const pageData = await client.get(
            `/products?type=all&page=${page}&pageSize=100`
          );
          allProducts = [...allProducts, ...pageData.data.products];
        }
      }
      
      setProducts(allProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await client.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.log(error);
      return null;
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
    getProductById,
    deleteProduct,
    handleUpdateProduct,
  };
};
