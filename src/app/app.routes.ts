import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { recoveryGuard } from './core/guards/recovery.guard';
import { adminRoutes } from './features/admin/admin.routes';
import { productsRoutes } from './features/products/products.routes';
import { profilesRoutes } from './features/profile/profiles.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/pages/pages.component').then((m) => m.PagesComponent),
        title: 'New Balance',
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/pages/cart-page/cart-page.component').then(
            (m) => m.CartPageComponent,
          ),
        title: 'New Balance - cart',
        canActivate: [authGuard],
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/pages/favorite/favorite.component').then(
            (m) => m.FavoriteComponent,
          ),
        title: 'New Balance - favorites',
        canActivate: [authGuard],
      },
      {
        path: 'new-arrivals',
        loadComponent: () =>
          import('./features/new-arrivals/pages/new-arrivals/new-arrivals.component').then(
            (m) => m.NewArrivalsComponent,
          ),
        title: 'New Balance - new',
      },
      {
        path: 'sale',
        loadComponent: () =>
          import('./features/sale/pages/sale-page/sale-page.component').then(
            (m) => m.SalePageComponent,
          ),
        title: 'New Balance - sale',
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/pages/checkout/checkout.component').then(
            (m) => m.CheckoutComponent,
          ),
        title: 'New Balance - checkout',
        canActivate: [authGuard],
      },
      {
        path: 'checkout/success',
        loadComponent: () =>
          import('./features/checkout/pages/checkout-success/checkout-success.component').then(
            (m) => m.CheckoutSuccessComponent,
          ),
        title: 'New Balance - заказ оформлен',
        canActivate: [authGuard],
      },

      ...productsRoutes,
      ...profilesRoutes,
    ],
  },
  ...adminRoutes,
  {
    path: 'update-password',
    loadComponent: () =>
      import('./features/update-password/pages/update-password/update-password.component').then(
        (m) => m.UpdatePasswordComponent,
      ),
    title: 'New Balance - обновление пароля',
    canActivate: [recoveryGuard],
  },

  // {
  //   path: '**',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
];
