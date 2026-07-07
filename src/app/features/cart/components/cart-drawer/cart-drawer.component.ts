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
import { ICartItem } from '../../../../shared/interfaces/cart-item.interface';
import { IProduct } from '../../../products/interfaces/product.interface';
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

  public cartProducts = signal<IProduct[] | null>([]);
  public cartInfoItem = signal<ICartItem[] | null>([]);

  public totalPrice = computed(() => {
    const products = this.cartProducts();
    const cartInfo = this.cartInfoItem();
    if (!products || !cartInfo) return 0;

    const subtotal = products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.product_id === product.id);
      const quantity = cartItem?.quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    return subtotal;
  });

  public delivery = computed(() => {
    const products = this.cartProducts();
    const cartInfo = this.cartInfoItem();
    if (!products || !cartInfo) return 990;

    const subtotal = products.reduce((sum, product) => {
      const cartItem = cartInfo.find((item) => item.product_id === product.id);
      return sum + product.price * (cartItem?.quantity ?? 1);
    }, 0);

    return subtotal < 15000 ? 990 : 0;
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
