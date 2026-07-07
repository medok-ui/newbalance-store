import { Routes } from '@angular/router';
import { authLoginGuard } from '../guards/auth-login.guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-page/auth-page.component').then((m) => m.AuthPageComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login-form/login-form.component').then((m) => m.LoginFormComponent),
        title: 'New Balance - login',
        canActivate: [authLoginGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register-form/register-form.component').then(
            (m) => m.RegisterFormComponent,
          ),
        title: 'New Balance - register',
        canActivate: [authLoginGuard],  
      },
    ],
  },
];
