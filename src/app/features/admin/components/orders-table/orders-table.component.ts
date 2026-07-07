import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { RouterLink } from "@angular/router";

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

  public async ngOnInit(): Promise<void> {
    const orders = (await this.supabaseService.getAllOrders()).slice(0, 10  );
    this.allOrders.set(orders);
  }
}
