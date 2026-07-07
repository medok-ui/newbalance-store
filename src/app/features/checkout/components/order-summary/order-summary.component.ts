import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ICartItem } from '../../../../shared/interfaces/cart-item.interface';
import { IProduct } from '../../../products/interfaces/product.interface';
import { CartService } from './../../../../core/services/cart.service';
import { OrderCardComponent } from './components/order-card/order-card.component';

@Component({
  selector: 'app-order-summary',
  imports: [OrderCardComponent, PriceFormatPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  private cartService = inject(CartService);
  private supabaseService = inject(SupabaseService);

  public currentProducts = signal<IProduct[] | null>([]);
  public currentInfoProducts = signal<ICartItem[] | null>(null);
  public deliveryPrice = signal<number>(990);

  public promoCode = signal<string>('');
  public promoDiscount = signal<number>(0);
  public promoError = signal<string>('');
  public promoSuccess = signal<boolean>(false);

  constructor() {
    effect(() => {
      const cartProduct = this.cartService.carts();
      const cartInfoProduct = this.cartService.cartsData();
      const deliveryPrice = this.cartService.deliveryPrice();
      const totalPrice = this.totalPrice() + this.delivery();
      if (!cartInfoProduct) return;

      this.deliveryPrice.set(deliveryPrice);

      this.cartService.totalPrice.set(totalPrice);

      this.currentInfoProducts.set(cartInfoProduct);
      this.currentProducts.set(cartProduct);
    });
  }

  public totalPrice = computed(() => {
    const products = this.currentProducts();
    const cartInfo = this.currentInfoProducts();
    if (!products || !cartInfo) return 0;

    const subtotal = products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.product_id === product.id);
      const quantity = cartItem?.quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    const discount = this.promoDiscount();
    return discount > 0 ? subtotal * (1 - discount / 100) : subtotal;
  });

  public delivery = computed(() => {
    const products = this.currentProducts();
    const cartInfo = this.currentInfoProducts();
    const delivery = this.deliveryPrice();
    if (!products || !cartInfo) return 990;

    const subtotal = products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.product_id === product.id);
      return sum + product.price * (cartItem?.quantity ?? 1);
    }, 0);

    return subtotal < 15000 ? delivery : 0;
  });

  public onPromoInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.promoCode.set(value);
  }

  public async applyPromo(): Promise<void> {
    const code = this.promoCode().trim().toUpperCase();
    const result = await this.supabaseService.checkPromoCode(code);
    if (result) {
      this.promoSuccess.set(true);
      this.promoDiscount.set(result.discount);
      this.promoError.set('');
    } else {
      this.promoError.set('Неверный промокод');
      this.promoSuccess.set(false);
      this.promoDiscount.set(0);
    }
  }
}
