
import inquirer from "inquirer";
import { getProductMetafield, updateProductMetafield } from "./utils.js";

// Sample product id 9128759558448
// Main function
async function main() {
  try {
    const metafieldParams = await promptMetafieldParams();

    const productMetafieldResponse = await getProductMetafield(metafieldParams.namespace, metafieldParams.key, metafieldParams.productId);

    if (!productMetafieldResponse?.product) {
      console.log(`Product with id ${metafieldParams.productId} doesn't exist`)
      return;
    }

    if (productMetafieldResponse) {
      // This function creates/updates product metafield
      await updateProductMetafield(metafieldParams, productMetafieldResponse.product);
    } else {
      console.log("Failed to fetch productMetafieldResponse. Aborting.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Prompt user for metafield parameters
const promptMetafieldParams = async () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'namespace',
      message: 'Enter the namespace for the metafield:',
      validate: (value) => value.trim() !== '' ? true : 'Please enter a namespace.'
    },
    {
      type: 'input',
      name: 'key',
      message: 'Enter the key for the metafield:',
      validate: (value) => value.trim() !== '' ? true : 'Please enter a key.'
    },
    {
      type: 'input',
      name: 'productId',
      message: 'Enter the ID for the product:',
      validate: (value) => value.trim() !== '' ? true : 'Please enter a product GID.'
    }
  ]);
}

main();
