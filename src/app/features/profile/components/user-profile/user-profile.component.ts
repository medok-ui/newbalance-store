import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
export class UserProfileComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public dataUser = signal<User | null>(this.supabaseService.currentUser());
  public infoUser = signal<IUserProfile | null>(null);

  async ngOnInit(): Promise<void> {
    const data = await this.supabaseService.getUser();
    this.infoUser.set(data);
  }
}
