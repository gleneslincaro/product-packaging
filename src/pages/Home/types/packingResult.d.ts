import { PackedProduct } from "./packedProduct";

export interface PackingResult {
  packages: {
    box: string;
    products: PackedProduct[];
    totalVolume: number;
    totalWeight: number;
  }[];
  error?: string;
}
