import { Routes } from '@angular/router';
import { authRoutes } from '../../core/auth/auth.routes';
import { authGuard } from '../../core/guards/auth.guard';

export const profilesRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
    title: 'New Balance - profile',

    children: [
      {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full',
      },
      {
        path: 'user-profile',
        canActivate: [authGuard],

        loadComponent: () =>
          import('./components/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
      },
      {
        path: 'setting',
        canActivate: [authGuard],

        loadComponent: () =>
          import('./components/settings-profile/settings-profile.component').then(
            (m) => m.SettingsProfileComponent,
          ),
      },
      {
        path: 'history',
        canActivate: [authGuard],

        loadComponent: () =>
          import('./pages/history/history.component').then((m) => m.HistoryComponent),
      },
    ],
  },
  ...authRoutes,
];
