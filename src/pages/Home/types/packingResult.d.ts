import { PackedProduct } from "./packedProduct";

export interface PackingResult {
  packages: {
    box: string;
    products: PackedProduct[];
  }[];
  error?: string;
}
