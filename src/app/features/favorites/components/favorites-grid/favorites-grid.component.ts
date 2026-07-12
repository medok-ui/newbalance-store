import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { ProductCatalogCardComponent } from '../../../products/components/product-catalog-card/product-catalog-card.component';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-favorites-grid',
  imports: [ProductCatalogCardComponent, RouterLink],
  templateUrl: './favorites-grid.component.html',
  styleUrl: './favorites-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesGridComponent {
  private favoritesService = inject(FavoritesService);
  public favoriteProducts = signal<IProduct[] | null>(null);

  constructor() {
    effect(() => {
      const favoriteProduct = this.favoritesService.favorites();

      this.favoriteProducts.set(favoriteProduct);
    });
  }
}
