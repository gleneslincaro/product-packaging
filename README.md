# Product Packaging App

This project is a product packaging application that helps you determine the best way to pack products into available boxes.

## Installation and Running the Project

1. Clone the repository:
  ```sh
  git clone https://github.com/gleneslincaro/product-packaging.git
  cd product-packaging
  ```

2. Install the dependencies:
  ```sh
  npm install
  ```

3. Run the project:
  ```sh
  npm start
  ```

## Instructions on How to Use the App

1. Browse the product list to select an item and specify the desired quantity.
2. In the selected products list, you can adjust the quantity or remove any product.
3. Click the "Pack Products" button to view the packing details.

## Examples of Inputs and Expected Outputs

### Example 1

**Input:**
- Products:
  - Product A: 10x10x10 cm, 1 kg, quantity: 2
  - Product B: 5x5x5 cm, 0.5 kg, quantity: 4
- Boxes:
  - Box 1: 20x20x20 cm, weight limit: 10 kg
  - Box 2: 15x15x15 cm, weight limit: 5 kg

**Expected Output:**
- Box 2:
  - Product A: 2 units
  - Product B: 4 units
  - Total Volume: 2500 cm³
  - Total Weight: 4 kg

### Example 2

**Input:**
- Products:
  - Product C: 30x30x30 cm, 5 kg, quantity: 1
  - Product D: 10x10x10 cm, 1 kg, quantity: 3
- Boxes:
  - Box 1: 40x40x40 cm, weight limit: 15 kg
  - Box 2: 50x50x50 cm, weight limit: 20 kg

**Expected Output:**
- Box 1:
  - Product C: 1 unit
  - Product D: 3 units
  - Total Volume: 30000 cm³
  - Total Weight: 8 kg

## Known Limitations or Edge Cases

- The app currently supports a maximum of 10 products.
- Products that are too large to fit into the largest available box will not be packed and will be listed in the error message.
- The app assumes that all products are rectangular and does not support other shapes.

