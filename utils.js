import { client } from "./index.js";

//Get product metafield
export const getProductMetafield = async (namespace, key, productId) => {
  const queryProductMetafieldOperation = `
      query ProductMetafield($namespace: String!, $key: String!, $ownerId: ID!) {
        product(id: $ownerId) {
          metafield: metafield(namespace: $namespace, key: $key) {
            value
            id
            legacyResourceId
            namespace,
            key
            type
          }
        }
      }
    `;
  try {
    const { data } = await client.request(queryProductMetafieldOperation, {
      variables: {
        namespace: namespace,
        key: key,
        ownerId: `gid://shopify/Product/${productId}`
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching product metafield:", error);
    return null;
  }
}

// Function to update or create product metafield
export const updateProductMetafield = async (metafieldParams, currentProductMetafield) => {

  const { namespace, key, productId } = metafieldParams;

  const updateProductMetafieldOperation = `
      mutation($id: ID!, $metafields: [MetafieldInput!]){
        productUpdate(input: {id: $id, metafields: $metafields} ) {
          userErrors {
            field
            message
          }
          product {
            metafields: metafield( namespace: "${namespace}", key: "${key}") {
              value
              id
              legacyResourceId
              namespace,
              key
              type
            }
          }
        }
      }
    `;


  const { value, id: metafieldId } = currentProductMetafield.metafield || {};

  const productGid = `gid://shopify/Product/${productId}`;
  const newValue = value ? parseInt(value) + 1 : 0;

  try {

    const updateProductMetafieldResult = await client.request(updateProductMetafieldOperation, {
      variables: {
        id: productGid,
        // When value and id is not defined and the namespace-key combination doesn't exist yet it will create new metafield
        // Otherwise it will update the metafield with the given new value
        metafields: [{ namespace, key, type: 'integer', value: newValue.toString(), id: metafieldId }]
      },
    });

    console.log('Updated metafield:', updateProductMetafieldResult.data.productUpdate.product)
    console.log("Product metafield updated successfully.");
  } catch (error) {
    console.error("Error updating product metafield:", error);
  }
}