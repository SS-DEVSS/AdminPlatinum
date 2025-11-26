import { Category, CategoryAttributesTypes } from "./category";
import { Image } from "./image";
import { Note } from "./note";
import { Reference } from "./reference";
import { TechnicalSheet } from "./technicalSheet";

export type Item = {
  id: string;
  name: string;
  type: "SINGLE" | "KIT";
  description: string;
  category: {
    id: string;
    name: string;
  };
  references: Reference[];
  variants?: Variant[];
  attributeValues: AttributeValue[];
};

export type Variant = {
  id: string;
  idProduct: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  notes: Note[];
  technicalSheets: TechnicalSheet[];
  images: Image[];
  kitItems: Variant[];
  attributeValues: [];
};

export type ProductDemo = {
  id: string;
  image: string;
  sku: string;
  brand: string;
  model: string;
  engine: string;
  year: string;
  diameter: number;
};

export interface AttributeValue {
  id: string;
  valueString?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: Date | null;
  idAttribute: string;
}

/** **/
export type Product = {
  id: string;
  sku: string;
  description: string;
  notes: Note[];
  documents: Document[];
  idCategory: Category["id"];
  references: Reference[];
  variants?: ProductVariant[];
  attributes?: CategoryAttributesTypes[];
};

export type ProductVariant = {
  id: string;
  img_url: string;
  name: string;
  sku: string;
  price?: number;
  quantity?: number;
};
