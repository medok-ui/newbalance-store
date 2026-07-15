import { inject, Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';
import { IProduct } from '../../features/products/interfaces/product.interface';

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { IOrder } from '../../shared/interfaces/order.interface';
import { ITopProduct } from '../../shared/interfaces/top-product.interface';
import { IAdminUser, IUserProfile } from '../../shared/interfaces/user.interface';
import { Router } from 'express';
// createClient — функция которая создаёт подключение к Supabase
// SupabaseClient — тип для TypeScript

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private sessionReady: Promise<void>;
  private router = inject(Router);
  public products = signal<IProduct[]>([]);
  public currentUser = signal<User | null>(null);
  public infoCurrentUser = signal<IUserProfile | null>(null);
  public userOrders = signal<IOrder[] | null>(null);
  public allUsers = signal<IAdminUser[] | null>(null);
  public allOrders = signal<IOrder[] | null>(null);
  public topProducts = signal<ITopProduct[] | null>(null);

  readonly client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  constructor() {
    this.sessionReady = this.initSession();
  }

  public async loadProducts(): Promise<void> {
    const { data, error } = await this.client.from('products').select('*, categories(name, slug)');
    // * — все поля товара
    // categories(name, slug) — подтягивает название категории по category_id
    if (error) throw error;
    this.products.set(data as IProduct[]);
  }

  public async loadProductById(id: number): Promise<IProduct> {
    const { data, error } = await this.client
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single();
    // eq('id', id) — фильтрует товары по id
    // single() — возвращает один объект вместо массива

    if (error) throw error;
    return data as IProduct;
  }

  public async loadProductByGender(gender: string): Promise<IProduct[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*, categories(name, slug)')
      .eq('gender', gender);
    if (error) throw error;
    return data as IProduct[];
  }

  private async initSession(): Promise<void> {
    const {
      data: { session },
    } = await this.client.auth.getSession();
    this.currentUser.set(session?.user ?? null);

    this.client.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        this.router.navigate(['/update-password']);
      }
    });
  }

  public async waitForSession(): Promise<void> {
    return this.sessionReady;
  }

  public async signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      await this.client.from('profiles').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
      });
    }
    return data;
  }

  public async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.currentUser.set(data.user);
    return data;
  }

  public async signOut(): Promise<void> {
    await this.client.auth.signOut();
    this.currentUser.set(null);
  }

  public async getUser(): Promise<void | null> {
    const user = this.currentUser();
    if (!user) return null;

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    this.infoCurrentUser.set(data as IUserProfile);
  }

  public async updateEmail(email: string): Promise<void> {
    const { data, error } = await this.client.auth.updateUser({ email });
    console.log(data);
    if (error) throw error;
  }

  public async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  public async updateDeliveryAddress(
    city: string,
    address: string,
    postal_code: string,
  ): Promise<void> {
    const { error } = await this.client
      .from('profiles')
      .update({ city, postal_code, address })
      .eq('id', this.currentUser()?.id);

    if (error) throw error;
  }

  public async updateUserProfile(
    first_name: string,
    last_name: string,
    phone: string,
  ): Promise<void> {
    const { error } = await this.client
      .from('profiles')
      .update({ first_name, last_name, phone })
      .eq('id', this.currentUser()?.id);

    if (error) throw error;
  }

  public async checkPromoCode(code: string): Promise<{ discount: number } | null> {
    const { data, error } = await this.client
      .from('promo_codes')
      .select('discount')
      .eq('code', code.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  }

  public async createStripePayment(
    amount: number,
    orderId: number,
  ): Promise<{ url: string; sessionId: string } | null> {
    const { data, error } = await this.client.functions.invoke('create-payment', {
      body: {
        amount,
        orderId,
        successUrl: `${window.location.origin}/checkout/success?order=${orderId}`,
        cancelUrl: `${window.location.origin}/checkout`,
      },
    });

    if (error) throw error;
    return data;
  }

  public async updateOrderPaymentId(orderId: number, paymentId: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({
        stripe_session_id: paymentId,
      })
      .eq('id', orderId);
    if (error) throw error;
  }

  public async isAdmin(): Promise<boolean> {
    const user = this.currentUser();
    if (!user) return false;

    const { data, error } = await this.client
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    return !error && !!data;
  }

  public async createOrder(total: number): Promise<number> {
    const userId = this.currentUser()?.id;
    const { data, error } = await this.client
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  public async createOrderItem(
    orderId: number,
    items: { product_id: number; size: number; quantity: number; price: number }[],
  ): Promise<void> {
    const { error } = await this.client
      .from('order_items')
      .insert(items.map((item) => ({ ...item, order_id: orderId })));

    if (error) throw error;
  }

  public async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const { error } = await this.client.from('orders').update({ status }).eq('id', orderId);

    if (error) throw error;
  }
  public async getOrders(): Promise<void> {
    const { data, error } = await this.client
      .from('orders')
      .select(
        `*,
              order_items (
                *,
                products ( name, images, price )
            )`,
      )
      .eq('user_id', this.currentUser()?.id)
      .order('created_at', { ascending: false });
    // ascending: false — сортировка по дате создания заказа, от новых к старым

    if (error) throw error;
    this.userOrders.set(data as IOrder[]);
  }

  public async getUsers(): Promise<void> {
    const { data, error } = await this.client.functions.invoke('get-users');
    if (error) throw error;
    this.allUsers.set(data as IAdminUser[]);
  }

  public async getAllOrders(): Promise<void> {
    const { data, error } = await this.client
      .from('orders')
      .select(
        `
        *,
        profiles (
          first_name, 
          last_name, 
          phone, 
          city, 
          address
        ),
        order_items (
          *,
          products ( name, images, price )
        )
      `,
      )
      .order('created_at', { ascending: false });
    // ascending: false — сортировка по дате создания заказа, от новых к старым
    if (error) throw error;
    this.allOrders.set(data as IOrder[]);
  }

  public async getTopProducts(limit: 10): Promise<void> {
    const { data, error } = await this.client.from('top_products').select('*').limit(limit);
    if (error) throw error;
    this.topProducts.set(data as ITopProduct[]);
  }

  public async deleteOrder(orderId: number): Promise<void> {
    const { error } = await this.client.from('orders').delete().eq('id', orderId);
    if (error) throw error;
  }

  public async uploadProductImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await this.client.storage.from('products').upload(filePath, file);

    if (error) throw error;

    const { data } = this.client.storage.from('products').getPublicUrl(filePath);
    return data.publicUrl;
  }

  public async createProduct(
    product: Omit<IProduct, 'id' | 'created_at' | 'categories'>,
  ): Promise<IProduct> {
    const { data, error } = await this.client
      .from('products')
      .insert(product)
      .select('*, categories(name, slug)')
      .single();
    if (error) throw error;
    return data as IProduct;
  }

  public async updateProduct(
    productId: number,
    product: Partial<Omit<IProduct, 'id' | 'created_at' | 'categories'>>,
  ): Promise<IProduct> {
    const { data, error } = await this.client
      .from('products')
      .update(product)
      .eq('id', productId)
      .select('*, categories(name, slug)')
      .single();
    if (error) throw error;
    return data as IProduct;
  }

  public async deleteProduct(productId: number): Promise<void> {
    const { error } = await this.client.from('products').delete().eq('id', productId);
    if (error) throw error;
  }

  public async deleteProductImage(url: string): Promise<void> {
    const path = url.split('/products/').slice(1).join('/products/');
    if (!path) return;

    const { error } = await this.client.storage.from('products').remove([path]);
    if (error) throw error;
  }

  public async resetPassword(email: string): Promise<void> {
    const getUrl = 'https://newbalance-store.vercel.app';

    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${getUrl}/update-password`,
    });

    if (error) {
      console.error('Ошибка при отправке письма:', error.message);
      throw error;
    }
  }
}
