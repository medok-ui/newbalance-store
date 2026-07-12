import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FavoritesGridComponent } from '../../components/favorites-grid/favorites-grid.component';

@Component({
  selector: 'app-favorite',
  imports: [FavoritesGridComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent {}
