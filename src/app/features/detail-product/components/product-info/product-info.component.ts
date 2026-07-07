import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { IProduct } from '../../../products/interfaces/product.interface';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';

@Component({
  selector: 'app-product-info',
  imports: [PriceFormatPipe],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent {
  public cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  public dataProduct = input.required<IProduct | null>();

  public currentSize = signal<number>(0);
  public isAddSizeText = signal<boolean>(false);

  public isFavorite = signal<boolean>(false);
  public isCart = signal<boolean>(false);

  constructor() {
    effect(() => {
      const product = this.dataProduct();
      if (!product) return;

      const isFav = this.favoritesService.isFavorite(product.id);
      const isCart = this.cartService.isCart(product.id);
      this.isFavorite.set(isFav ?? false);
      this.isCart.set(isCart ?? false);
    });
  }

  public toggleFavoriteList(): void {
    this.favoritesService.toggleFavorite(this.dataProduct()!.id);
  }

  public onSize(size: number): void {
    this.currentSize.set(size);
    this.isAddSizeText.set(false);
  }

  public getStars(count: number | undefined): number[] {
    const roundedCount = Math.round(count ?? 0);
    return new Array(roundedCount);
  }

  public async addToCart() {
    const productId = this.dataProduct()?.id;
    const size = this.currentSize();
    const quantity = 1;

    if (!size) {
      this.isAddSizeText.set(true);
      return;
    }
    if (!productId || !quantity) return;

    await this.cartService.addToCart(productId, size, quantity);
  }
}
