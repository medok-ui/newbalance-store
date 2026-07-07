import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';

type TOrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-order-status',
  imports: [ModalComponent],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent {
  public order = input.required<IOrder | null>();
  private supabaseService = inject(SupabaseService);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public async changeStatus(newStatus: TOrderStatus): Promise<void> {
    this.showModal('wait', 'Пожалуйста подождите, статус обновляется...');
    await this.supabaseService.updateOrderStatus(this.order()!.id, newStatus);
    this.showModal('success', 'Статус успешно обновлен!');
  }

  public async deleteOrder(): Promise<void> {
    await this.supabaseService.deleteOrder(this.order()!.id);
    this.showModal('success', 'Заказ успешно удалён!');
  }
}
