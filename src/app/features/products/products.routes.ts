import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: 'catalog',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then((m) => m.ProductsPageComponent),
    title: 'New Balance - catalog',
  },
  {
    path: 'catalog/:gender',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then((m) => m.ProductsPageComponent),
    title: 'New Balance - catalog',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('../detail-product/pages/product-page/product-page.component').then(
        (m) => m.ProductPageComponent,
      ),
    title: 'New Balance - product',
  },
];
