import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IUserProfile } from '../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-profile',
  imports: [DatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private supabaseService = inject(SupabaseService);
  public dataUser = signal<User | null>(this.supabaseService.currentUser());
  public infoUser = signal<IUserProfile | null>(null);
  public isVisiblePhone = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.dataUser.set(this.supabaseService.currentUser());
      this.infoUser.set(this.supabaseService.infoCurrentUser());
    });
  }

  public onVisiblePhone(): void {
    this.isVisiblePhone.update((prev) => !prev);
  }
}
