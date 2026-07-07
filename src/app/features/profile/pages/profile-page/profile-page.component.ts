import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IMenuItem, MENU_ITEMS } from '../../profiles.constants';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  public menuItems = signal<IMenuItem[]>(MENU_ITEMS);
  private supabaseService = inject(SupabaseService);
  private route = inject(Router);

  public async onLogOut(): Promise<void> {
    await this.supabaseService.signOut();
    this.route.navigate(['/auth/login']);
  }
}
