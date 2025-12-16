import { Brand } from "./brand";

export type Category = {
  id?: string;
  name: string;
  imgUrl: string;
  description: string;
  brands?: Brand[];
  attributes?: CategoryAtributes[];
  products?: string[];
};

export type CategoryResponse = {
  id?: string;
  name: string;
  imgUrl: string;
  description: string;
  brands?: Brand[];
  attributes?: {
    product: CategoryAtributes[];
    variant: CategoryAtributes[];
  };
  products?: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
  }>;
};

export enum CategoryAttributesTypes {
  STRING = "string",
  NUMERIC = "number",
  DATE = "date",
  BOOLEAN = "boolean",
}

export const typesArray = Object.values(CategoryAttributesTypes);

export type CategoryAtributes = {
  id?: string;
  name: string;
  required: boolean;
  type: CategoryAttributesTypes;
  order: number;
  scope: "PRODUCT" | "VARIANT";
  id_category?: string;
};
