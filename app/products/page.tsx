import { Suspense } from 'react';
import { getActiveProducts } from '@/lib/products';
import { ProductsClient } from './products-client';

export const metadata = {
  title: 'Shop all kitchen tools',
  description: 'Cookware, utensils, serveware and storage — built to last.'
};

export default function ProductsPage() {
  const products = getActiveProducts();
  return (
    <Suspense fallback={null}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
