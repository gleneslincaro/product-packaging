import React from "react";
import { render, screen } from "@testing-library/react";
import BoxResultsCard from "../BoxResultsCard";
import { PackedProduct } from "../../types";

describe("BoxResultsCard", () => {
  const mockProducts: PackedProduct[] = [
    { id: 1, name: "Product 1", quantity: 2, height: 5, width: 5, length: 5, weight: 10 },
    { id: 2, name: "Product 2", quantity: 3, height: 15, width: 15, length: 10, weight: 10 },
  ];

  it("should render box title", () => {
    render(
      <BoxResultsCard
        box="Box 1"
        products={mockProducts}
        totalVolume={100}
        totalWeight={200}
      />
    );
    expect(screen.getByText("Box 1")).toBeInTheDocument();
  });

  it("should render product list", () => {
    render(
      <BoxResultsCard
        box="Box 1"
        products={mockProducts}
        totalVolume={100}
        totalWeight={200}
      />
    );
    expect(screen.getByText("Product 1 (Quantity: 2)")).toBeInTheDocument();
    expect(screen.getByText("Product 2 (Quantity: 3)")).toBeInTheDocument();
  });

  it("should render total volume and weight", () => {
    render(
      <BoxResultsCard
        box="Box 1"
        products={mockProducts}
        totalVolume={100}
        totalWeight={200}
      />
    );
    expect(screen.getByText("Total Volume: 100 m³")).toBeInTheDocument();
    expect(screen.getByText("Total Weight: 200 kg")).toBeInTheDocument();
  });
});
