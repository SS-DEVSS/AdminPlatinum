import Layout from "@/components/Layouts/Layout";
import { useCategories } from "@/hooks/useCategories";
import CategoryCU from "@/modules/categories/CatgegoryCU";

const NewCategory = () => {
  const { addCategory } = useCategories();
  return (
    <Layout>
      <CategoryCU addCategory={addCategory} />
    </Layout>
  );
};

export default NewCategory;
