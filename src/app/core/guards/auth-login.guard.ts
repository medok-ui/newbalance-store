import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authLoginGuard: CanActivateFn = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const user = supabaseService.currentUser();

  if (!user) {
    return true;
  }

  router.navigate(['/profile']);
  return false;
};
