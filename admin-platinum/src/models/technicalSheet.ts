import { Variant } from "./item";

export interface TechnicalSheet {
  id?: string;
  title: string;
  path?: string;
  url?: string;
  description: string;
  variant?: Variant | null;
}
