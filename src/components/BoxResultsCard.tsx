// BoxResultsCard.tsx
import React from 'react';
import { PackedProduct } from '../types';

interface BoxResultsCardProps {
  box: string;
  products: PackedProduct[];
}

const BoxResultsCard: React.FC<BoxResultsCardProps> = ({ box, products }) => {
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
    </div>
  );
};

export default BoxResultsCard;
