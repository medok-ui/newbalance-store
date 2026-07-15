import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  await supabaseService.waitForSession();

  const user = supabaseService.currentUser();
  if (user) return true;

  router.navigate(['/auth/login']);
  return false;
};
