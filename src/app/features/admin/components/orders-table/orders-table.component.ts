import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-orders-table',
  imports: [PriceFormatPipe, RouterLink],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTableComponent {
  private supabaseService = inject(SupabaseService);
  public allOrders = signal<IOrder[]>([]);

  public ngOnInit(): void {
    const orders = this.supabaseService.allOrders();
    if (!orders) return;
    this.allOrders.set(orders.slice(0, 10));
  }
}
