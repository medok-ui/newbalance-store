import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ICartDisplayItem } from '../../shared/interfaces/cart-display-item.interface';
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

  public carts = signal<ICartDisplayItem[] | null>([]);
  public cartsData = signal<ICartItem[]>([]);

  public async getCart(): Promise<void> {
    const { data, error } = await this.client.from('cart').select('*');
    if (error) throw error;
    this.cartsData.set(data);

    const allProducts = this.supabaseService.products();

    const displayItems: ICartDisplayItem[] = (data as ICartItem[])
      .map((cartRow) => {
        const product = allProducts.find((p) => p.id === cartRow.product_id);
        return product ? { cartItemId: cartRow.id, product } : null;
      })
      .filter((item): item is ICartDisplayItem => item !== null);

    this.carts.set(displayItems);
  }

  public async addToCart(productId: number, size: number, quantity: number): Promise<void> {
    const userId = this.supabaseService.currentUser()?.id;

    const { data: existingItem, error: fetchError } = await this.client
      .from('cart')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .maybeSingle();

    if (fetchError) throw fetchError;
    const finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    const { data, error } = await this.client
      .from('cart')
      .upsert(
        {
          user_id: userId,
          product_id: productId,
          size,
          quantity: finalQuantity,
        },
        { onConflict: 'user_id,product_id,size' },
      )
      .select()
      .single();

    if (error) throw error;

    this.cartsData.update((prev) => {
      const exists = prev.some((item) => item.id === data.id);

      return exists ? prev.map((item) => (item.id === data.id ? data : item)) : [...prev, data];
    });

    const product = this.supabaseService.products().find((p) => p.id === productId);
    if (!product) return;

    this.carts.update((prev) => {
      const current = prev || [];

      const exists = current.some((p) => p.cartItemId === data.id);
      return exists
        ? current.map((item) =>
            item.cartItemId === data.id ? { cartItemId: data.id, product } : item,
          )
        : [...current, { cartItemId: data.id, product }];
    });
  }

  public isCart(productId: number): boolean | undefined {
    const cartProducts = this.carts();
    return cartProducts?.some((item) => item.product.id === productId);
  }

  public async removeFromCart(cartItemId: number): Promise<void> {
    const { error } = await this.client.from('cart').delete().eq('id', cartItemId);
    if (error) throw error;

    this.carts.update((prev) => prev?.filter((item) => item.cartItemId !== cartItemId) ?? null);
    this.cartsData.update((prev) => prev!.filter((item) => item.id !== cartItemId));
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
