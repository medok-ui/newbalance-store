import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-history-orders',
  imports: [OrderCardComponent, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public orders = signal<IOrder[]>([]);

  public async ngOnInit(): Promise<void> {
    const allOrders = await this.supabaseService.getOrders();
    this.orders.set(allOrders);
  }
}
