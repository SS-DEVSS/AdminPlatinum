/** Types for subcategory and tree node (productCount) in API responses. */
export type Subcategory = {
  id: string;
  name: string;
  description: string | null;
  imgUrl: string | null;
  categoryId: string | null;
  parentId: string | null;
  children?: Subcategory[];
  category?: { id: string; name: string };
};

export type SubcategoryTreeNode = Subcategory & {
  productCount?: number;
};
