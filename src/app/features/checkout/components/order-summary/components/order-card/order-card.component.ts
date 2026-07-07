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
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';
import { CartService } from '../../../../../../core/services/cart.service';
import { ICartItem } from '../../../../../../shared/interfaces/cart-item.interface';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-order-card',
  imports: [PriceFormatPipe, RouterLink],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent implements OnInit {
  private cartService = inject(CartService);

  public productData = input.required<IProduct>();
  public cartInfoProducts = signal<ICartItem | null>(null);
  public quantity = signal<number>(1);

  constructor() {
    effect(() => {
      const dataProduct = this.productData();
      const infoProduct = this.cartService.cartsData();
      if (!infoProduct) return;

      const currentInfoProduct = infoProduct.find((p) => p.product_id === dataProduct.id) ?? null;

      this.cartInfoProducts.set(currentInfoProduct);
    });
  }

  public ngOnInit(): void {
    const infoProduct = this.cartService.cartsData();
    const currentInfoProduct =
      infoProduct.find((p) => p.product_id === this.productData().id) ?? null;
    this.quantity.set(currentInfoProduct?.quantity ?? 1);
  }
}
