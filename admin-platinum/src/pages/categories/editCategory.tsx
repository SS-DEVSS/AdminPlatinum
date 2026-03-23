import Layout from "@/components/Layouts/Layout";
import { useCategoryContext } from "@/context/categories-context";
import CategoryCU from "@/modules/categories/CatgegoryCU";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { category, updateCategory, getCategoryById } = useCategoryContext();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/categorias", { replace: true });
      return;
    }
    setFetching(true);
    void getCategoryById(id).finally(() => setFetching(false));
    // getCategoryById is stable enough in practice; including it would refetch every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  if (!id) {
    return null;
  }

  if (fetching) {
    return <Loader fullScreen message="Cargando categoría..." />;
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">No se pudo cargar la categoría.</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/categorias")}
        >
          Volver a categorías
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <CategoryCU category={category} updateCategory={updateCategory} />
    </Layout>
  );
};

export default EditCategory;
