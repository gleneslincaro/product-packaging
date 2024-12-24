import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductInputForm from "../ProductInputForm";
import { Product } from "../../types";

describe("ProductInputForm", () => {
  const mockProducts: Product[] = [
    { id: 1, name: "Product 1", height: 5, width: 5, length: 5, weight: 10, quantity: 1 },
    { id: 2, name: "Product 2", height: 15, width: 15, length: 10, weight: 10, quantity: 1 },
  ];

  const mockOnAddProduct = jest.fn();

  it("should render search field and product list", () => {
    render(
      <ProductInputForm
        products={mockProducts}
        onAddProduct={mockOnAddProduct}
      />
    );

    expect(screen.getByLabelText("Search products")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("should filter products based on search term", () => {
    render(
      <ProductInputForm
        products={mockProducts}
        onAddProduct={mockOnAddProduct}
      />
    );

    fireEvent.change(screen.getByLabelText("Search products"), {
      target: { value: "Product 1" },
    });

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.queryByText("Product 2")).not.toBeInTheDocument();
  });

  it("should select a product and set quantity", () => {
    render(
      <ProductInputForm
        products={mockProducts}
        onAddProduct={mockOnAddProduct}
      />
    );

    fireEvent.click(screen.getByText("Product 1"));

    expect(screen.getByText("Selected Product: Product 1")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "3" },
    });

    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });

  it("should call onAddProduct with selected product and quantity", () => {
    render(
      <ProductInputForm
        products={mockProducts}
        onAddProduct={mockOnAddProduct}
      />
    );

    fireEvent.click(screen.getByText("Product 1"));
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByText("Add Product"));

    expect(mockOnAddProduct).toHaveBeenCalledWith({
      ...mockProducts[0],
      quantity: 3,
    });
  });
});
