import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { IProduct } from '../../features/products/interfaces/product.interface';
import { IFavorite } from '../../shared/interfaces/favorite.interface';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  readonly client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  private supabaseService = inject(SupabaseService);
  public favorites = signal<IProduct[] | null>([]);

  public async addToCart(productId: number): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { error } = await this.client
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select();

    if (error) throw error;

    const product = this.supabaseService.products().find((p) => p.id === productId);
    if (product) {
      this.favorites.update((prev) => [...prev!, product]);
    }
  }

  public async getCart(): Promise<void> {
    const { data, error } = await this.client.from('favorites').select();
    if (error) throw error;

    const allProduct = this.supabaseService.products();
    const favoriteIds = (data as IFavorite[]).map((f) => f.product_id);
    const currentProduct = allProduct.filter((p) => favoriteIds.includes(p.id));

    this.favorites.set(currentProduct);
  }

  public isFavorite(productId: number): boolean | undefined {
    const favoriteProducts = this.favorites();
    const isFavoriteProduct = favoriteProducts?.some((p) => p.id === productId);
    return isFavoriteProduct;
  }

  public async toggleFavorite(productId: number): Promise<void> {
    const isFavorite = this.isFavorite(productId);
    if (isFavorite) {
      return this.removeFromCart(productId);
    }
    this.addToCart(productId);
  }

  public async removeFromCart(productId: number): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { error } = await this.client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    this.favorites.update((prev) => prev?.filter((p) => p.id !== productId) ?? null);
  }
}
