import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { CartService } from '../../../../core/services/cart.service';
import { ICartDisplayItem } from '../../../../shared/interfaces/cart-display-item.interface';
import { ICartItem } from '../../../../shared/interfaces/cart-item.interface';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink, CartItemComponent, PriceFormatPipe],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawerComponent {
  private cartService = inject(CartService);

  public cartProducts = signal<ICartDisplayItem[] | null>([]);
  public cartInfoItem = signal<ICartItem[] | null>([]);

  public totalPrice = computed(() => {
    const products = this.cartProducts();
    const cartInfo = this.cartInfoItem();
    if (!products || !cartInfo) return 0;

    return products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.id === product.cartItemId);
      const quantity = cartItem?.quantity ?? 1;
      return sum + product.product.price * quantity;
    }, 0);
  });

  public delivery = computed(() => {
    const products = this.cartProducts();
    const cartInfo = this.cartInfoItem();
    if (!products || !cartInfo) return 990;

    const subtotal = products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.id === product.cartItemId);
      return sum + product.product.price * (cartItem?.quantity ?? 1);
    }, 0);

    return subtotal < 15000 ? 990 : 0;
  });

  public cartLength = computed(() => {
    const cartInfo = this.cartInfoItem();
    if (!cartInfo) return;
    
    return cartInfo.reduce((acc, item) => acc + item.quantity, 0);
  });

  constructor() {
    effect(() => {
      const allCartProduct = this.cartService.carts();
      const cartInfo = this.cartService.cartsData();
      if (!allCartProduct || !cartInfo) return;

      this.cartProducts.set(allCartProduct);
      this.cartInfoItem.set(cartInfo);
    });
  }
}
