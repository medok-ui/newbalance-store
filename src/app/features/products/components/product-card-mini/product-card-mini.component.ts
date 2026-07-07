import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { IProduct } from '../../interfaces/product.interface';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';

@Component({
  selector: 'app-product-card-mini',
  imports: [RouterLink, PriceFormatPipe],
  templateUrl: './product-card-mini.component.html',
  styleUrl: './product-card-mini.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardMiniComponent {
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
