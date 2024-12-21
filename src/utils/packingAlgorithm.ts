import { Box, Product, PackingResult, PackedProduct } from "../types";

// Utility function to calculate volume
const calculateVolume = (length: number, width: number, height: number) =>
  length * width * height;

export const packProducts = (
  products: Product[],
  boxes: Box[]
): PackingResult => {
  const packedResults: PackingResult["packages"] = [];
  const remainingProducts = [...products];

  // Sort products by volume in ascending order (smaller products first)
  const sortedProducts = remainingProducts.sort((a, b) => {
    const volumeA = calculateVolume(a.length, a.width, a.height);
    const volumeB = calculateVolume(b.length, b.width, b.height);
    return volumeA - volumeB;
  });

  // Sort boxes by volume in ascending order (smaller boxes first)
  const sortedBoxes = boxes.sort(
    (a, b) =>
      calculateVolume(a.length, a.width, a.height) -
      calculateVolume(b.length, b.width, b.height)
  );
  const tooBigProducts: string[] = [];

  // Try to fit products into boxes
  for (const box of sortedBoxes) {
    let boxWeight = 0;
    let boxVolume = calculateVolume(box.length, box.width, box.height);
    const boxProducts: PackedProduct[] = [];

    const largestBox = sortedBoxes[sortedBoxes.length - 1];

    for (let i = 0; i < sortedProducts.length; i++) {
      const product = sortedProducts[i];
      const totalProductVolume =
        calculateVolume(product.length, product.width, product.height) *
        product.quantity;

      if (
        (product.length > largestBox.length ||
          product.width > largestBox.width ||
          product.height > largestBox.height) &&
        !tooBigProducts.includes(product.name)
      ) {
        tooBigProducts.push(product.name);
      }

      // Check if the product fits in the current box
      if (
        product.length <= box.length &&
        product.width <= box.width &&
        product.height <= box.height &&
        boxWeight + product.weight * product.quantity <= box.weight_limit &&
        totalProductVolume <= boxVolume
      ) {
        // Add the product to the box
        boxProducts.push({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
        });
        boxWeight += product.weight * product.quantity;

        // Remove the product from the remaining products list
        sortedProducts.splice(i, 1);
        i--; // Adjust the index after removing an item
      }
    }

    if (boxProducts.length > 0) {
      // If there are products packed into the box, save the result
      packedResults.push({
        box: box.name,
        products: boxProducts,
      });
    }

    if (sortedProducts.length === 0) {
      // If there are no remaining products, stop packing
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
