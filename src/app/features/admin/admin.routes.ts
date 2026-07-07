import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    redirectTo: 'dashboard/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard/login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'New Balance - login',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'New Balance - Dashboard',
        canActivate: [adminGuard],
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products-list/products-list.component').then(
            (m) => m.ProductsListComponent,
          ),
        title: 'New Balance - Products',
        canActivate: [adminGuard],
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/new-product/pages/new-product/new-product.component').then(
            (m) => m.NewProductComponent,
          ),
        title: 'New Balance - New Product',
        canActivate: [adminGuard],
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
        title: 'New Balance - Product Edit',
        canActivate: [adminGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
        title: 'New Balance - Orders',
        canActivate: [adminGuard],
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
        title: 'New Balance - Order Detail',
        canActivate: [adminGuard],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users-list/users-list.component').then((m) => m.UsersListComponent),
        title: 'New Balance - Users',
        canActivate: [adminGuard],
      },
    ],
  },
];
