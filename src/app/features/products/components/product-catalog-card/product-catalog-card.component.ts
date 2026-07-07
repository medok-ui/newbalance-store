import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { IProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-catalog-card',
  imports: [RouterLink, PriceFormatPipe],
  templateUrl: './product-catalog-card.component.html',
  styleUrl: './product-catalog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCatalogCardComponent {
  public dataProduct = input.required<IProduct>();
  private favoritesService = inject(FavoritesService);

  public isFavorite = computed(() => this.favoritesService.isFavorite(this.dataProduct().id));

  public toggleFavoriteList(event: Event): void {
    // Остановка всплытия события и предотвращение перехода по ссылке для кнопки "В избранное"
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.toggleFavorite(this.dataProduct().id);
  }
}
