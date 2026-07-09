import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { IOrder } from '../../../../shared/interfaces/order.interface';
import { OrderCardComponent } from './components/order-card/order-card.component';

@Component({
  selector: 'app-history-orders',
  imports: [OrderCardComponent, RouterLink, ModalComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public orders = signal<IOrder[]>([]);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public ngOnInit(): void {
    const allOrders = this.supabaseService.userOrders();
    if (!allOrders) {
      this.showModal(
        'error',
        'Не удалось загрузить историю заказов.\n' +
          'Пожалуйста, попробуйте обновить страницу чуть позже.',
      );
      return;
    }
    this.orders.set(allOrders);
  }
}
