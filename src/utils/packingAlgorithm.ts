import { Box, Product, PackingResult, PackedProduct } from "../types";
import _ from "lodash";

const calculateVolume = (length: number, width: number, height: number) =>
  length * width * height;

const sortByVolume = <T extends { length: number; width: number; height: number }>(items: T[]) =>
  _.sortBy(items, (item) => calculateVolume(item.length, item.width, item.height));

const canFitInBox = (product: Product, box: Box, boxWeight: number, boxVolume: number) => {
  const totalProductVolume = calculateVolume(product.length, product.width, product.height) * product.quantity;
  return (
    product.length <= box.length &&
    product.width <= box.width &&
    product.height <= box.height &&
    boxWeight + product.weight * product.quantity <= box.weight_limit &&
    totalProductVolume <= boxVolume
  );
};

const packIntoBox = (box: Box, products: Product[], largestBox: Box, tooBigProducts: string[]) => {
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

export const packProducts = (
  products: Product[],
  boxes: Box[]
): PackingResult => {
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
