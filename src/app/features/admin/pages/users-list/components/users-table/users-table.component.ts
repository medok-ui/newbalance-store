import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { IAdminUser } from '../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-users-table',
  imports: [DatePipe, CdkCopyToClipboard],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent {
  public searchQuery = signal<string>('');
  public users = input.required<IAdminUser[]>();

  public allUsers = computed(() => {
    const users = this.users();

    const query = this.searchQuery().toLowerCase();
    return users.filter((user) => user.profile?.first_name!.toLowerCase().includes(query));
  });

  public searchUser(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
