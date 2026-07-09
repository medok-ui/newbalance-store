import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DeliveryComponent } from '../../components/delivery/delivery.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { RecipientComponent } from '../../components/recipient/recipient.component';
import { CartService } from './../../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [
    RecipientComponent,
    DeliveryComponent,
    OrderSummaryComponent,
    RouterLink,
    ModalComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  private supabaseService = inject(SupabaseService);
  private cartService = inject(CartService);
  public checkoutService = inject(CheckoutService);

  public isLoading = signal<boolean>(false);
  private totalPrice = signal<number>(0);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  constructor() {
    effect(() => {
      const totalPrice = this.cartService.totalPrice();
      this.totalPrice.set(totalPrice);
    });
  }

  public async onSubmitOrder(): Promise<void> {
    try {
      this.isLoading.set(true);

      const cartItems = this.cartService.cartsData();
      const products = this.cartService.carts();

      const orderId = await this.supabaseService.createOrder(this.totalPrice());

      const orderItems = cartItems.map((cartItem) => {
        const product = products?.find((p) => p.cartItemId === cartItem.product_id);
        return {
          product_id: cartItem.product_id,
          size: cartItem.size,
          quantity: cartItem.quantity,
          price: product?.product.price ?? 0,
        };
      });

      await this.supabaseService.createOrderItem(orderId, orderItems);

      const paymentData = await this.supabaseService.createStripePayment(
        this.totalPrice(),
        orderId,
      );

      if (paymentData && paymentData.url) {
        await this.supabaseService.updateOrderPaymentId(orderId, paymentData.sessionId);
        window.location.href = paymentData.url;
      }

      this.isLoading.set(false);
    } catch (error) {
      this.isLoading.set(false);
      this.showModal('error', `Ошибка в процессе оплаты: ${error}`);
    }
  }
}
