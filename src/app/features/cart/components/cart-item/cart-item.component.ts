import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { CartService } from '../../../../core/services/cart.service';
import { ICartItem } from '../../../../shared/interfaces/cart-item.interface';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, PriceFormatPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent implements OnInit {
  private cartService = inject(CartService);
  public dataProduct = input.required<IProduct>();
  public cartInfoProducts = signal<ICartItem | null>(null);
  public quantity = signal<number>(1);

  constructor() {
    effect(() => {
      const dataProduct = this.dataProduct();
      const infoProduct = this.cartService.cartsData();
      if (!infoProduct) return;

      const currentInfoProduct = infoProduct.find((p) => p.product_id === dataProduct.id) ?? null;

      this.cartInfoProducts.set(currentInfoProduct);
    });
  }

  public ngOnInit(): void {
    const infoProduct = this.cartService.cartsData();
    const currentInfoProduct =
      infoProduct.find((p) => p.product_id === this.dataProduct().id) ?? null;
    this.quantity.set(currentInfoProduct?.quantity ?? 1);
  }

  public deleteProduct(): void {
    const productId = this.dataProduct().id;
    const cartItemId = this.cartInfoProducts()?.id;
    if (!cartItemId) return;

    this.cartService.removeFromCart(productId, cartItemId);
  }

  public onPlusQuantity(): void {
    const cartItemId = this.cartInfoProducts()?.id;
    if (!cartItemId) return;

    this.quantity.update((val) => val + 1);
    this.cartService.updateQuantity(cartItemId, this.quantity());
  }
  public onMinusQuantity(): void {
    const cartItemId = this.cartInfoProducts()?.id;
    if (!cartItemId) return;

    this.quantity.update((val) => (val > 1 ? val - 1 : val));
    this.cartService.updateQuantity(cartItemId, this.quantity());
  }
}
