import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IUserProfile } from '../../../../shared/interfaces/user.interface';
import { CartService } from './../../../../core/services/cart.service';
import { DELIVERY_OPTIONS } from './delivery.constants';

@Component({
  selector: 'app-delivery',
  imports: [PriceFormatPipe],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);

  public deliveryOptions = signal(DELIVERY_OPTIONS);
  public totalPrice = signal<number>(0);
  public deliveryPrice = signal<number>(990);

  public userData = signal<IUserProfile | null>(null);
  public selectedDeliveryId = signal<string>('courier');

  constructor() {
    effect(() => {
      const totalPrice = this.cartService.totalPrice();
      this.cartService.deliveryPrice.set(this.deliveryPrice());
      this.totalPrice.set(totalPrice);
    });
  }

  public  ngOnInit(): void {
    const data = this.supabaseService.infoCurrentUser();
    this.userData.set(data);

    this.checkoutService.isCheckoutUserDataValid.set(!!data?.address);
  }

  public onDeliveryOption(id: string, price: number): void {
    this.deliveryPrice.set(price);

    this.selectedDeliveryId.set(id);
  }
}
