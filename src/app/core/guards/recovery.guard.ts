import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const recoveryGuard: CanActivateFn = (route, state) => {
  const hash = window.location.hash;
  const router = inject(Router);

  if (hash && hash.includes('type=recovery')) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
