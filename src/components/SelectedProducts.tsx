import React from 'react';
import { Product } from '../types';
import { List, ListItem, ListItemText, IconButton, Box, Typography } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

// Define the props for SelectedProducts
interface SelectedProductsProps {
  products: Product[];
  onIncreaseQuantity: (index: number) => void;
  onDecreaseQuantity: (index: number) => void;
  onRemoveProduct: (index: number) => void;
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  products,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveProduct,
}) => {
  return (
    <Box className="selected-products-list" sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Selected Products
      </Typography>
      <List>
        {products.map((product, index) => (
          <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemText
              primary={product.name}
              secondary={`Quantity: ${product.quantity}`}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Decrease quantity */}
              <IconButton
                onClick={() => onDecreaseQuantity(index)}
                color="primary"
                size="small"
                sx={{ marginRight: 1 }}
              >
                <Remove />
              </IconButton>

              {/* Increase quantity */}
              <IconButton
                onClick={() => onIncreaseQuantity(index)}
                color="primary"
                size="small"
                sx={{ marginRight: 1 }}
              >
                <Add />
              </IconButton>

              {/* Remove Product */}
              <IconButton
                onClick={() => onRemoveProduct(index)}
                color="error"
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SelectedProducts;
