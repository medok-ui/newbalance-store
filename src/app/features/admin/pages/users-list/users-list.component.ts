import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IAdminUser } from '../../../../shared/interfaces/user.interface';
import { UsersTableComponent } from './components/users-table/users-table.component';

@Component({
  selector: 'app-users-list',
  imports: [UsersTableComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  private supabaseService = inject(SupabaseService);
  public allUsers = signal<IAdminUser[]>([]);

  public ngOnInit(): void {
    const users = this.supabaseService.allUsers();
    if (!users) return;
    this.allUsers.set(users);
  }
}
