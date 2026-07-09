import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';
import { IAdminUser } from '../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-person',
  imports: [DatePipe],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonComponent {
  private supabaseService = inject(SupabaseService);
  public order = input.required<IOrder | null>();

  public allOrdersUser = signal<IOrder[]>([]);
  public currentUser = signal<IAdminUser | undefined>(undefined);

  public async ngOnInit(): Promise<void> {
    const orders = this.supabaseService.userOrders();
    const users = await this.supabaseService.getUsers();
    const currentUser = users.find((user) => user.id === this.order()?.user_id);
    if (!orders) return;
    this.allOrdersUser.set(orders);
    this.currentUser.set(currentUser);
  }
}
