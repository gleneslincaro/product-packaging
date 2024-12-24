import { useMemo, useState } from "react";
import _ from "lodash";
import { PackingResult, Product, PackingBox, PackedProduct } from "../types";

const MAX_NUMBER_OF_PRODUCTS_TO_INPUT = 10;
const MAX_NUMBER_OF_PRODUCTS_REACHED_ERROR = `You can only input up to ${MAX_NUMBER_OF_PRODUCTS_TO_INPUT} products.`;

const usePacking = (availableBoxes: PackingBox[]) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packingResults, setPackingResults] = useState<
    PackingResult["packages"]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const totalNumberOfSelectedProducts = useMemo(
    () => products.reduce((sum, product) => sum + product.quantity, 0),
    [products]
  );

  const calculateVolume = (length: number, width: number, height: number) =>
    length * width * height;

  const sortByVolume = <
    T extends { length: number; width: number; height: number }
  >(
    items: T[]
  ) =>
    _.sortBy(items, (item) =>
      calculateVolume(item.length, item.width, item.height)
    );

  const sortByWeight = <T extends { weight: number }>(items: T[]) =>
    _.sortBy(items, (item) => item.weight);

  const getPackedProductsTotalVolume = (sortedProducts: PackedProduct[]) =>
    sortedProducts.reduce(
      (sum, product) =>
        sum +
        calculateVolume(product.length, product.width, product.height) *
          product.quantity,
      0
    );

  const getPackedProductsTotalWeight = (sortedProducts: PackedProduct[]) =>
    sortedProducts.reduce(
      (sum, product) => sum + product.weight * product.quantity,
      0
    );

  const canFitInOneBox = (products: Product[], box: PackingBox) => {
    let totalWeight = 0;
    let totalVolume = 0;

    for (let product of products) {
      const productVolume =
        calculateVolume(product.length, product.width, product.height) *
        product.quantity;
      const productWeight = product.weight * product.quantity;
      totalVolume += productVolume;
      totalWeight += productWeight;

      if (
        product.length > box.length ||
        product.width > box.width ||
        product.height > box.height ||
        totalWeight > box.weight_limit ||
        totalVolume > calculateVolume(box.length, box.width, box.height)
      ) {
        return false;
      }
    }

    return true;
  };

  const productTooLarge = (): Product | undefined => {
    let sortedProducts = sortByVolume(products);
    const sortedBoxes = sortByVolume(availableBoxes);
    const largestProduct = _.last(sortedProducts);
    const largestBox = _.last(sortedBoxes);
    if (
      largestProduct &&
      largestBox &&
      (largestProduct.length > largestBox.length ||
        largestProduct.width > largestBox.width ||
        largestProduct.height > largestBox.height)
    ) {
      return largestProduct;
    }
  };

  const productTooHeavy = (): Product | undefined => {
    let sortedProducts = sortByWeight(products);
    const sortedBoxes = sortByWeight(
      availableBoxes.map((box) => ({ weight: box.weight_limit }))
    );
    const mostHeavyProduct = _.last(sortedProducts);
    const largestBoxByWeightLimit = _.last(sortedBoxes);
    if (
      mostHeavyProduct &&
      largestBoxByWeightLimit &&
      mostHeavyProduct.weight > largestBoxByWeightLimit.weight
    ) {
      return mostHeavyProduct;
    }
  };

  const packProducts = (
    products: Product[],
    boxes: PackingBox[]
  ): PackingResult => {
    const packedResults: PackingResult["packages"] = [];
    const clonedProducts = _.cloneDeep(products);

    let sortedProducts = sortByVolume(clonedProducts);
    const sortedBoxes = sortByVolume(boxes);

    const tooLargeProduct = productTooLarge();
    if (tooLargeProduct) {
      return {
        error: `Product "${tooLargeProduct.name}" cannot fit to the largest box.`,
        packages: packedResults,
      };
    }

    const tooHeavyProduct = productTooHeavy();
    if (tooHeavyProduct) {
      return {
        error: `Product "${tooHeavyProduct.name}" too heavy for any box.`,
        packages: packedResults,
      };
    }

    // Try to decrement the quantity 1 by 1 until it fits in one box
    let remainingProducts: Product[] = [];
    while (sortedProducts.length > 0 || remainingProducts.length > 0) {
      if (remainingProducts.length > 0 && sortedProducts.length === 0) {
        sortedProducts = remainingProducts;
        remainingProducts = [];
      }

      for (const box of sortedBoxes) {
        if (canFitInOneBox(sortedProducts, box)) {
          packedResults.push({
            box: box.name,
            products: sortedProducts.map((product) => ({
              id: product.id,
              name: product.name,
              height: product.height,
              width: product.width,
              length: product.length,
              weight: product.weight,
              quantity: product.quantity,
            })),
            totalVolume: getPackedProductsTotalVolume(sortedProducts),
            totalWeight: getPackedProductsTotalWeight(sortedProducts),
          });
          sortedProducts = [];
          break;
        }
      }

      // Decrement the quantity of the largest product by 1
      if (sortedProducts.length > 0) {
        const largestProduct = _.last(sortedProducts);
        if (largestProduct) {
          if (largestProduct.quantity > 1) {
            largestProduct.quantity -= 1;
          } else {
            sortedProducts.pop();
          }
          const largestProductIndex = remainingProducts.findIndex(
            (p) => p.id === largestProduct.id
          );
          if (largestProductIndex === -1) {
            remainingProducts.push({
              ...largestProduct,
              quantity: 1,
            });
          } else {
            remainingProducts[largestProductIndex].quantity += 1;
          }
        }
      }
    }

    return {
      packages: packedResults,
    };
  };

  const handleAddProduct = (product: Product) => {
    if (
      totalNumberOfSelectedProducts + product.quantity >
      MAX_NUMBER_OF_PRODUCTS_TO_INPUT
    ) {
      setError(MAX_NUMBER_OF_PRODUCTS_REACHED_ERROR);
      return;
    }
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
    if (totalNumberOfSelectedProducts + 1 > MAX_NUMBER_OF_PRODUCTS_TO_INPUT) {
      setError(MAX_NUMBER_OF_PRODUCTS_REACHED_ERROR);
      return;
    }
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
    if (newProducts.length === 0) {
      setPackingResults([]);
    }
    setProducts(newProducts);
  };

  const handleErrorDialogClose = () => {
    setError(null);
  };

  return {
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
  };
};

export default usePacking;
