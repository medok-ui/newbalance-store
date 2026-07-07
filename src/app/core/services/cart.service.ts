import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { IProduct } from '../../features/products/interfaces/product.interface';
import { ICartItem } from '../../shared/interfaces/cart-item.interface';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  private supabaseService = inject(SupabaseService);

  public totalPrice = signal<number>(0);
  public deliveryPrice = signal<number>(990);

  public carts = signal<IProduct[] | null>([]);
  public cartsData = signal<ICartItem[]>([]);

  public async getCart(): Promise<void> {
    const { data, error } = await this.client.from('cart').select('*');
    if (error) throw error;
    this.cartsData.set(data);

    const allProduct = this.supabaseService.products();
    const cartIds = (data as ICartItem[]).map((f) => f.product_id);
    const currentProduct = allProduct.filter((p) => cartIds.includes(p.id));

    this.carts.set(currentProduct);
  }

  public async addToCart(productId: number, size: number, quantity: number): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { data, error } = await this.client
      .from('cart')
      .insert({
        user_id: userId,
        product_id: productId,
        size,
        quantity,
      })
      .select()
      .single();
    if (error) throw error;

    this.cartsData.update((prev) => [...prev!, data]);

    const product = this.supabaseService.products().find((p) => p.id === productId);
    if (product) {
      this.carts.update((prev) => [...prev!, product]);
    }
  }

  public isCart(productId: number): boolean | undefined {
    const cartProducts = this.carts();
    const isCartProduct = cartProducts?.some((p) => p.id === productId);
    return isCartProduct;
  }

  public async removeFromCart(productId: number, cartItemId: number): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { error } = await this.client
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    this.carts.update((prev) => prev?.filter((p) => p.id !== productId) ?? null);

    this.cartsData.update((prev) =>
      prev!.map((item) => (item.id === cartItemId ? { ...item, quantity: 1 } : item)),
    );
  }

  public async updateQuantity(cartItemId: number, quantity: number): Promise<void> {
    const { error } = await this.client.from('cart').update({ quantity }).eq('id', cartItemId);
    if (error) throw error;

    this.cartsData.update((prev) =>
      prev?.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)),
    );
  }

  public async clearCart(): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { error } = await this.client.from('cart').delete().eq('user_id', userId);
    if (error) throw error;

    this.carts.set([]);
    this.cartsData.set([]);
  }
}
