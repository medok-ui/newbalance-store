import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-promo-banner',
  imports: [RouterLink],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBannerComponent {
  private supabaseService = inject(SupabaseService);
  public saleProducts = signal<IProduct[]>([]);

  public discountedProducts = computed(() => {
    const allProducts = this.saleProducts();
    const saleProducts = allProducts.filter((product) => product.discount! > 0);
    const maxDiscount = Math.max(...saleProducts.map((product) => product.discount!));

    return maxDiscount;
  });

  constructor() {
    effect(() => {
      const product = this.supabaseService.products();
      const saleProducts = product.filter((p) => p.badge === 'sale');

      this.saleProducts.set(saleProducts);
    });
  }
}
