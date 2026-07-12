import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { IStatItem } from '../../../../shared/interfaces/stat-item.inteface';
import { IAdminUser } from '../../../../shared/interfaces/user.interface';
import { OrdersTableComponent } from '../../components/orders-table/orders-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TopProductsComponent } from '../../components/top-products/top-products.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatsCardComponent, OrdersTableComponent, TopProductsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public allOrders = signal<IOrder[]>([]);
  public allUsers = signal<IAdminUser[]>([]);

  public ngOnInit(): void {
    const orders = this.supabaseService.allOrders();
    const users = this.supabaseService.allUsers();
    if (!users || !orders) return;
    this.allOrders.set(orders);
    this.allUsers.set(users);
  }

  public stats = computed<IStatItem[]>(() => [
    {
      label: 'Товаров в каталоге',
      value: this.supabaseService.products().length,
      icon: '/assets/svgs/box.svg',
    },
    {
      label: 'Всего заказов',
      value: this.allOrders().length,
      icon: '/assets/svgs/orders.svg',
    },
    {
      label: 'Пользователей',
      value: this.allUsers().length,
      icon: '/assets/svgs/user-white.svg',
    },
  ]);
}
