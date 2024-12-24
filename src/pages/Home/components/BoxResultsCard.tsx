import React from "react";
import { PackedProduct } from "../types";
import { Typography } from "@mui/material";

interface BoxResultsCardProps {
  box: string;
  products: PackedProduct[];
  totalVolume: number;
  totalWeight: number;
}

const BoxResultsCard: React.FC<BoxResultsCardProps> = ({
  box,
  products,
  totalVolume,
  totalWeight,
}) => {
  return (
    <div className="box-results-card">
      <h3>{box}</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} (Quantity: {product.quantity})
          </li>
        ))}
      </ul>
      <Typography variant="body2" color="#459789">
        Total Volume: {totalVolume.toLocaleString()} m³
      </Typography>
      <Typography variant="body2" color="#459789">
        Total Weight: {totalWeight.toLocaleString()} kg
      </Typography>
    </div>
  );
};

export default BoxResultsCard;
