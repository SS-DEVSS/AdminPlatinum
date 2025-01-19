import { Category } from "@/models/category";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";

interface ContextCategoryTypes {
  selectedCategory: Category["id"] | null;
  setSelectedCategory: Dispatch<Category["id"] | null>;
}

const CategoryContext = createContext<ContextCategoryTypes>({} as any);

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    Category["id"] | null
  >(null);
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
