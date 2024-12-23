import { renderHook, act } from "@testing-library/react-hooks";
import { PackingBox, Product } from "../Home/types";
import usePacking from "../Home/hooks/usePacking";

describe("usePacking", () => {
  const availableBoxes: PackingBox[] = [
    { id: 1, name: "Small Box", length: 10, width: 10, height: 10, weight_limit: 100 },
    {
      id: 2,
      name: "Medium Box",
      length: 20,
      width: 20,
      height: 20,
      weight_limit: 200,
    },
    { id: 3, name: "Large Box", length: 30, width: 30, height: 30, weight_limit: 300 },
  ];

  it("should add a product", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(product);
    });

    expect(result.current.products).toEqual([product]);
  });

  it("should pack products into boxes", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(product);
      result.current.handlePackProducts();
    });
    expect(result.current.packingResults).toEqual([
      {
        box: "Small Box",
        products: [{ id: 1, name: "Product 1", quantity: 1 }],
      },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("should handle products that cannot fit in any box", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Large Product",
      length: 50,
      width: 50,
      height: 50,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(product);
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults).toEqual([]);
    expect(result.current.error).toBe(
      'Product "Large Product" cannot fit to the largest box.'
    );
  });

  it("should increase product quantity", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(product);
      result.current.handleIncreaseQuantity(0);
    });

    expect(result.current.products[0].quantity).toBe(2);
  });

  it("should decrease product quantity", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
      quantity: 2,
    };

    act(() => {
      result.current.handleAddProduct(product);
      result.current.handleDecreaseQuantity(0);
    });

    expect(result.current.products[0].quantity).toBe(1);
  });

  it("should remove a product", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(product);
      result.current.handleRemoveProduct(0);
    });

    expect(result.current.products).toEqual([]);
  });

  it("should close error dialog", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));

    act(() => {
      result.current.handleErrorDialogClose();
    });

    expect(result.current.error).toBeNull();
  });
});
