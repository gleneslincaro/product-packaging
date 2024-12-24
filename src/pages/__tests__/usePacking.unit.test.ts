import { renderHook, act } from "@testing-library/react";
import { Product } from "../Home/types";
import usePacking from "../Home/hooks/usePacking";
import availableBoxes from "../../data/boxes.json";

const smallProduct: Product = {
  id: 5,
  name: "Phone Charger",
  length: 8,
  width: 6,
  height: 3,
  weight: 0.2,
  quantity: 1,
};
const extraMediumProduct: Product = {
  id: 3,
  name: "Laptop Stand",
  length: 30,
  width: 20,
  height: 10,
  weight: 2.0,
  quantity: 1,
};
const mediumProduct: Product = {
  id: 2,
  name: "Gaming Keyboard",
  length: 45,
  width: 15,
  height: 4,
  weight: 1.5,
  quantity: 1,
};

const largeProduct: Product = {
  id: 37,
  name: "Speaker System",
  length: 60,
  width: 35,
  height: 40,
  weight: 10.0,
  quantity: 1,
};

describe("usePacking", () => {
  it("should initialize with empty products", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    expect(result.current.products).toEqual([]);
  });

  it("should initialize with empty packing results", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    expect(result.current.packingResults).toEqual([]);
  });

  it("should initialize with no error", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    expect(result.current.error).toBeNull();
  });

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

  it("should not allow adding of products more than 10", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 11 });
    });

    expect(result.current.error).toBe("You can only input up to 10 products.");
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
    });

    act(() => {
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
    });

    act(() => {
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

  it("should pack 3 small products to Small box A", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 3 });
    });

    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults.length).toEqual(1);
    expect(result.current.packingResults[0].box).toEqual("BOX A");
    expect(result.current.error).toBeNull();
  });

  it("should pack 3 small products and 1 extra medium products to a single box - BOX B", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 3 });
      result.current.handleAddProduct({ ...extraMediumProduct, quantity: 1 });
    });
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults.length).toEqual(1);
    expect(result.current.packingResults[0].box).toEqual("BOX B");
  });

  it("should pack 2 large products to a separate box each - BOX C", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...largeProduct, quantity: 2 });
    });
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults.length).toEqual(2);
    expect(result.current.packingResults[0].box).toEqual("BOX C");
    expect(result.current.packingResults[1].box).toEqual("BOX C");
  });

  it("should pack 3 large products, 1 medium products and 4 small products efficiently to multiple boxes", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 4 });
      result.current.handleAddProduct({ ...mediumProduct, quantity: 1 });
      result.current.handleAddProduct({ ...largeProduct, quantity: 3 });
    });
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults).toHaveLength(3);

    expect(result.current.packingResults).toEqual([
      {
        box: "BOX C",
        products: [
          { ...smallProduct, quantity: 4 },
          { ...mediumProduct, quantity: 1 },
          { ...largeProduct, quantity: 1 },
        ],
        totalVolume: expect.any(Number),
        totalWeight: expect.any(Number),
      },
      {
        box: "BOX C",
        products: [{ ...largeProduct, quantity: 1 }],
        totalVolume: expect.any(Number),
        totalWeight: expect.any(Number),
      },
      {
        box: "BOX C",
        products: [{ ...largeProduct, quantity: 1 }],
        totalVolume: expect.any(Number),
        totalWeight: expect.any(Number),
      },
    ]);
  });

  it("should pack 4 small products and 4 medium products to a single box - BOX D", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 4 });
      result.current.handleAddProduct({ ...mediumProduct, quantity: 4 });
    });
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults.length).toEqual(1);
    expect(result.current.packingResults[0].box).toEqual("BOX D");
  });

  it("should pack 3 small products and 3 extra medium products to a single box - BOX E", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handleAddProduct({ ...smallProduct, quantity: 3 });
      result.current.handleAddProduct({ ...extraMediumProduct, quantity: 3 });
    });
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults.length).toEqual(1);
    expect(result.current.packingResults[0].box).toEqual("BOX E");
  });

  it("should throw error for a product that is too large for any box", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const tooBigProduct: Product = {
      id: 1,
      name: "Too big Product",
      length: 80,
      width: 80,
      height: 50,
      weight: 10,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(tooBigProduct);
    });

    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults).toEqual([]);
    expect(result.current.error).toBe(
      'Product "Too big Product" cannot fit to the largest box.'
    );
  });

  it("should throw error for product that is too heavy for any box", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    const tooBigProduct: Product = {
      id: 1,
      name: "Too heavy product",
      length: 30,
      width: 20,
      height: 10,
      weight: 80,
      quantity: 1,
    };

    act(() => {
      result.current.handleAddProduct(tooBigProduct);
    });

    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults).toEqual([]);
    expect(result.current.error).toBe(
      'Product "Too heavy product" too heavy for any box.'
    );
  });

  it("should handle when trying to pack with no added products", () => {
    const { result } = renderHook(() => usePacking(availableBoxes));
    act(() => {
      result.current.handlePackProducts();
    });

    expect(result.current.packingResults).toEqual([]);
  });
});
