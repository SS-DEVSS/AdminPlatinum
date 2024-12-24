import { Brand } from "./brand";

export type Category = {
  id?: string;
  name: string;
  imgUrl: string;
  description: string;
  brands?: Brand["id"][];
  attributes?: CategoryAtributes[];
  products?: string[];
};

export enum CategoryAttributesTypes {
  STRING = "string",
  NUMERIC = "number",
  DATE = "date",
  BOOLEAN = "boolean",
}

export const typesArray = Object.values(CategoryAttributesTypes);

console.log(typesArray);

export type CategoryAtributes = {
  id?: string;
  id_category?: string;
  name: string;
  type: CategoryAttributesTypes;
  required: boolean;
  order: number;
  scope: "PRODUCT" | "VARIANT";
};
