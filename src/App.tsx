import React, { useState } from "react";
import { Button, Typography, Box, Container, Grid, Card } from "@mui/material";
import { packProducts } from "./utils/packingAlgorithm";
import { Product, PackingResult } from "./types";

import productsData from "./data/products.json";
import availableBoxes from "./data/boxes.json";

import SelectedProducts from "./components/SelectedProducts";
import Error from "./components/common/Error";
import ProductInputForm from "./components/ProductInputForm";
import BoxResultsCard from "./components/BoxResultsCard";

import "./styles/global.css";
import "./styles/appLayout.css";
import "./styles/productForm.css";
import "./styles/packingResults.css";
import "./styles/buttons.css";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packingResults, setPackingResults] = useState<
    PackingResult["packages"]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handlePackProducts = () => {
    const results = packProducts(products, availableBoxes);
    if (results.error) {
      setError(results.error);
    } else {
      setPackingResults(results.packages);
      setError(null);
    }
  };

  const handleIncreaseQuantity = (index: number) => {
    const newProducts = [...products];
    newProducts[index].quantity += 1;
    setProducts(newProducts);
  };

  const handleDecreaseQuantity = (index: number) => {
    const newProducts = [...products];
    if (newProducts[index].quantity > 1) {
      newProducts[index].quantity -= 1;
    }
    setProducts(newProducts);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleErrorDialogClose = () => {
    setError(null);
  };

  return (
    <Container maxWidth="md" className="container">
      <Box className="text-center" sx={{ marginBottom: 3 }}>
        <Typography variant="h3" gutterBottom>
          Product Packing Application
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Add products and pack them into boxes efficiently
        </Typography>
      </Box>

      {/* Product Input Form */}
      <ProductInputForm
        products={productsData.map((product) => ({ ...product, quantity: 1 }))}
        onAddProduct={handleAddProduct}
      />

      {/* Selected Products Component */}
      {products.length > 0 && (
        <SelectedProducts
          products={products}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onRemoveProduct={handleRemoveProduct}
        />
      )}

      {/* Pack Products Button */}
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePackProducts}
          disabled={products.length === 0}
          sx={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Pack Products
        </Button>
      </Box>

      {error && products.length && (
        <Error errorMessage={error} onClose={handleErrorDialogClose} />
      )}
      

      {/* Packing Results */}
      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h5" gutterBottom>
          Packing Results
        </Typography>

        {packingResults.length > 0 ? (
          <Grid container spacing={2}>
            {packingResults.map((result, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <BoxResultsCard box={result.box} products={result.products} />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No packing results yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default App;
