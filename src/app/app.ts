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

    await this.supabaseService.waitForSession();
    await this.initAppData();
  }

  private async initAppData(): Promise<void> {
    await this.supabaseService.loadProducts();
    try {
      await Promise.all([
        this.supabaseService.getTopProducts(10),
        this.supabaseService.getUser(),
        this.cartService.getCart(),
        this.favoritesService.getCart(),
        this.supabaseService.getOrders(),
        this.supabaseService.getUsers(),
        this.supabaseService.getAllOrders(),
      ]);
    } catch (err) {
      console.error('Ошибка при загрузке данных юзера:', err);
      this.supabaseService.signOut();
    } finally {
      this.isLoading.set(false);
    }
  }
}
