import Layout from "@/components/Layouts/Layout";
import { useCategories } from "@/hooks/useCategories";
import CategoryCU from "@/modules/categories/CatgegoryCU";

const EditCategory = () => {
  const { category } = useCategories();
  console.log(category);
  return (
    <Layout>
      <CategoryCU category={category} />
    </Layout>
  );
};

export default EditCategory;
