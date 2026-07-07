import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-products-list',
  imports: [PriceFormatPipe, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private supabaseService = inject(SupabaseService);
  public searchQuery = signal<string>('');

  public allProducts = computed(() => {
    const products = [...this.supabaseService.products()].sort((a, b) => a.id - b.id);
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => product.name.toLowerCase().includes(query));
  });

  public searchProduct(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  public async deleteProduct(productId: number): Promise<void> {
    await this.supabaseService.deleteProduct(productId);
    this.supabaseService.products.update((products) =>
      products.filter((product) => product.id !== productId),
    );
  }
}
