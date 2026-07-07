import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

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

  public async ngOnInit(): Promise<void> {
    const orders = await this.supabaseService.getAllOrders();
    this.allOrders.set(orders);
  }
}
