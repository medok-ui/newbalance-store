import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-orders-list',
  imports: [PriceFormatPipe, DatePipe, RouterLink],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public allOrders = signal<IOrder[]>([]);

  public ngOnInit(): void {
    const orders = this.supabaseService.allOrders();
    if (!orders) return;
    this.allOrders.set(orders);
  }
}
