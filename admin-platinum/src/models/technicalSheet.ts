import { Variant } from "./item";

export interface TechnicalSheet {
  id?: string;
  title: string;
  path?: string;
  url?: string;
  imgUrl?: string | null;
  description: string;
  variant?: Variant | null;
}

/** **/
export type Document = {
  id: string;
  title: string;
  document_url?: string;
};
