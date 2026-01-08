import Layout from "@/components/Layouts/Layout";
import { useCategoryContext } from "@/context/categories-context";
import CategoryCU from "@/modules/categories/CatgegoryCU";

const EditCategory = () => {
  const { category, updateCategory } = useCategoryContext();
  return <Layout><CategoryCU category={category} updateCategory={updateCategory} /></Layout>;
};

export default EditCategory;
