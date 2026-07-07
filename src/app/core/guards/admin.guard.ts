import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const adminGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const isAdmin = await supabaseService.isAdmin();

  if (isAdmin) {
    return true;
  }

  return router.createUrlTree(['/dashboard/login']);
};
