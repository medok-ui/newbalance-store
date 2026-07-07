import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { FavoritesService } from './core/services/favorites.service';
import { SupabaseService } from './core/services/supabase.service';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private supabaseService = inject(SupabaseService);
  private favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);

  public isLoading = signal<boolean>(false);

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);

    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        return this.supabaseService.currentUser.set(session.user);
      }
      this.supabaseService.currentUser.set(null);
    });

    await this.supabaseService.loadProducts();
    await this.favoritesService.getCart();
    await this.cartService.getCart();

    this.isLoading.set(false);
  }
}
