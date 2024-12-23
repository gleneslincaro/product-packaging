import React, { useState } from "react";
import { Product } from "../types";
import { TextField, Button, List, ListItem, Box, Typography } from "@mui/material";

interface ProductInputFormProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

const ProductInputForm: React.FC<ProductInputFormProps> = ({
  products,
  onAddProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (selectedProduct) {
      onAddProduct({ ...selectedProduct, quantity });
      setSearchTerm("");
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Products to Pack
      </Typography>

      {/* Search Field */}
      <TextField
        fullWidth
        label="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        margin="normal"
      />

      {/* Product List */}
      <List sx={{ maxHeight: 200, overflowY: 'auto', marginBottom: 2 }}>
        {filteredProducts.map((product) => (
          <ListItem
            component="li"
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            sx={{
              backgroundColor:
                selectedProduct?.id === product.id ? "lightgray" : "transparent",
              padding: "10px",
              marginBottom: "5px",
            }}
          >
            {product.name}
          </ListItem>
        ))}
      </List>

      {/* Selected Product and Quantity */}
      {selectedProduct && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1" gutterBottom>
            Selected Product: {selectedProduct.name}
          </Typography>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            variant="outlined"
            fullWidth
            InputProps={{
              inputProps: { min: 1 },
            }}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddProduct}
            sx={{ marginTop: 2 }}
          >
            Add Product
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductInputForm;
