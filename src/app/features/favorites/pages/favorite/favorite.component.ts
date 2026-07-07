import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { IProduct } from '../../../products/interfaces/product.interface';
import { FavoritesGridComponent } from '../../components/favorites-grid/favorites-grid.component';

@Component({
  selector: 'app-favorite',
  imports: [FavoritesGridComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent {
  private favoritesService = inject(FavoritesService);
  // public allFavorite = signal<IProduct[]>(this.favoritesService.favorites());

  // constructor() {
  //   effect(() => {
  //     this.allFavorite();
  //   });
  // }
}
