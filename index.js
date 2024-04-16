import { createAdminApiClient } from '@shopify/admin-api-client';
import dotenv from 'dotenv';
dotenv.config();
export const client = createAdminApiClient({
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
    apiVersion: process.env.SHOPIFY_API_VERSION,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});



