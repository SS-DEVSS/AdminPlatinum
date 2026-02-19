import Layout from "@/components/Layouts/Layout";
import { useCategoryContext } from "@/context/categories-context";
import CategoryCU from "@/modules/categories/CatgegoryCU";
import Loader from "@/components/Loader";

const EditCategory = () => {
  const { category, updateCategory, loading } = useCategoryContext();

  if (loading || !category) {
    return <Loader fullScreen message="Cargando categoría..." />;
  }

  return (
    <Layout>
      <CategoryCU category={category} updateCategory={updateCategory} />
    </Layout>
  );
};

export default EditCategory;
