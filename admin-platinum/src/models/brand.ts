import { Category } from "./category";

export type Brand = {
  id: string;
  name: string;
  logo_img_url: string;
  description?: string;
  categories?: Category[];
};
