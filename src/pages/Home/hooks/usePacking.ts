import { useState } from "react";
import _ from "lodash";
import { PackingResult, Product, PackingBox, PackedProduct } from "../types";

const usePacking = (availableBoxes: PackingBox[]) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packingResults, setPackingResults] = useState<PackingResult["packages"]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateVolume = (length: number, width: number, height: number) =>
    length * width * height;

  const sortByVolume = <T extends { length: number; width: number; height: number }>(items: T[]) =>
    _.sortBy(items, (item) => calculateVolume(item.length, item.width, item.height));

  const canFitInBox = (product: Product, box: PackingBox, boxWeight: number, boxVolume: number) => {
    const totalProductVolume = calculateVolume(product.length, product.width, product.height) * product.quantity;
    return (
      product.length <= box.length &&
      product.width <= box.width &&
      product.height <= box.height &&
      boxWeight + product.weight * product.quantity <= box.weight_limit &&
      totalProductVolume <= boxVolume
    );
  };

  const packIntoBox = (box: PackingBox, products: Product[], largestBox: PackingBox, tooBigProducts: string[]) => {
    let boxWeight = 0;
    let boxVolume = calculateVolume(box.length, box.width, box.height);
    const boxProducts: PackedProduct[] = [];

    _.remove(products, (product) => {
      if (
        largestBox &&
        (product.length > largestBox.length ||
          product.width > largestBox.width ||
          product.height > largestBox.height) &&
        !tooBigProducts.includes(product.name)
      ) {
        tooBigProducts.push(product.name);
      }

      if (canFitInBox(product, box, boxWeight, boxVolume)) {
        boxProducts.push({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
        });
        boxWeight += product.weight * product.quantity;
        return true;
      }
      return false;
    });

    return boxProducts;
  };

  const packProducts = (products: Product[], boxes: PackingBox[]): PackingResult => {
    const packedResults: PackingResult["packages"] = [];
    const remainingProducts = [...products];

    const sortedProducts = sortByVolume(remainingProducts);
    const sortedBoxes = sortByVolume(boxes);
    const tooBigProducts: string[] = [];

    for (const box of sortedBoxes) {
      const largestBox = _.last(sortedBoxes);

      if (!largestBox) {
        continue;
      }
      const boxProducts = packIntoBox(box, sortedProducts, largestBox, tooBigProducts);

      if (boxProducts.length > 0) {
        packedResults.push({
          box: box.name,
          products: boxProducts,
        });
      }

      if (sortedProducts.length === 0) {
        break;
      }
    }

    return {
      ...(tooBigProducts.length > 0 && {
        error: `Product "${tooBigProducts.join(
          '", "'
        )}" cannot fit to the largest box.`,
      }),
      packages: packedResults,
    };
  };

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
  };
};

export default usePacking;