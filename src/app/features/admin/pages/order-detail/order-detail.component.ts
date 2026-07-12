import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { BuyerComponent } from './components/buyer/buyer.component';
import { OrderContentsComponent } from './components/order-contents/order-contents.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { PaymentAttemptsComponent } from './components/payment-attempts/payment-attempts.component';
import { PersonComponent } from './components/person/person.component';
import { TotalComponent } from './components/total/total.component';

@Component({
  selector: 'app-order-detail',
  imports: [
    BuyerComponent,
    OrderContentsComponent,
    OrderStatusComponent,
    PaymentAttemptsComponent,
    PersonComponent,
    TotalComponent,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  public supabaseService = inject(SupabaseService);
  public orderId = toSignal(this.activatedRoute.params.pipe(map((params) => Number(params['id']))));

  public currentOrder = signal<IOrder | null>(null);

  public ngOnInit(): void {
    const orders = this.supabaseService.allOrders();
    if (!orders) return;
    const currentOrder = orders.find((p) => p.id === this.orderId()) ?? null;
    this.currentOrder.set(currentOrder);
  }
}
