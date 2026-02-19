import { Image } from "./image";
import { TechnicalSheet } from "./technicalSheet";

// export type Variant = {
//   id: string;
//   name: string;
//   sku: string | null;
//   price: number | null;
//   stockQuantity: number | null;
//   attributeValues?: AttributeValue[];
//   images?: VariantImage[];
//   techSheets?: TechnicalSheet[] | null;
//   kitItems?: Variant[] | null;
//   idProduct?: string;
// };

export type Variant = {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  stockQuantity: number | null;
  attributeValues?: [];
  images?: Image[];
  techSheets?: TechnicalSheet[] | null;
  kitItems?: Variant[] | null;
  idProduct?: string;
};
