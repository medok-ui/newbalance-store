import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SearchBlockComponent } from '../../shared/components/search-block/search-block.component';
import { INavIcon, INavLink, NAV_ICONS, NAV_LINKS } from './header.constants';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBlockComponent, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly navLinks = signal<INavLink[]>(NAV_LINKS);
  readonly navIcons = signal<INavIcon[]>(NAV_ICONS);

  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  public isSearching = signal<boolean>(false);

  public cartCount = computed(() => this.cartService.carts()?.length ?? 0);
  public favoritesCount = computed(() => this.favoritesService.favorites()?.length ?? 0);

  public onSearch(): void {
    this.isSearching.update((value) => !value);
  }

  public getBadge(id: string): number {
    if (id === 'cart') return this.cartCount();
    if (id === 'favorites') return this.favoritesCount();
    return 0;
  }
}
