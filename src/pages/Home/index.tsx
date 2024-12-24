import React from "react";
import { Button, Typography, Box, Container, Grid, Card } from "@mui/material";

import productsData from "../../data/products.json";
import availableBoxes from "../../data/boxes.json";

import "./styles/productForm.css";
import "./styles/packingResults.css";

import SelectedProducts from "./components/SelectedProducts";
import Error from "../../common/components/Error";
import ProductInputForm from "./components/ProductInputForm";
import BoxResultsCard from "./components/BoxResultsCard";
import usePacking from "./hooks/usePacking";
import AvailableBoxes from "./components/AvailableBoxes";

const Home: React.FC = () => {
  const {
    products,
    packingResults,
    error,
    handleAddProduct,
    handlePackProducts,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveProduct,
    handleErrorDialogClose,
    calculateVolume,
  } = usePacking(availableBoxes);
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

      <AvailableBoxes
        availableBoxes={availableBoxes}
        calculateVolume={calculateVolume}
      />

      {/* Product Input Form */}
      <ProductInputForm
        products={productsData.map((product: any) => ({
          ...product,
          quantity: 1,
        }))}
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

      {error && (
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
                  <BoxResultsCard
                    box={result.box}
                    products={result.products}
                    totalVolume={result.totalVolume}
                    totalWeight={result.totalWeight}
                  />
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

export default Home;
