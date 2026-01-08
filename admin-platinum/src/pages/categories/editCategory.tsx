import Layout from "@/components/Layouts/Layout";
import { useCategoryContext } from "@/context/categories-context";
import { useCategories } from "@/hooks/useCategories";
import CategoryCU from "@/modules/categories/CatgegoryCU";

const EditCategory = () => {
  const { category } = useCategoryContext();
  const { updateCategory } = useCategories();
  return <Layout><CategoryCU category={category} updateCategory={updateCategory} /></Layout>;
};

export default EditCategory;
