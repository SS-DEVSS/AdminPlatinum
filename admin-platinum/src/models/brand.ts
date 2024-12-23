import { Category } from "./category";

export type Brand = {
  id?: string;
  name: string;
  logoImgUrl: string;
  description?: string;
  categories?: Category[];
};
