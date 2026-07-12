import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ITopProduct } from '../../../../shared/interfaces/top-product.interface';

@Component({
  selector: 'app-top-products',
  imports: [PriceFormatPipe, RouterLink],
  templateUrl: './top-products.component.html',
  styleUrl: './top-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopProductsComponent {
  private supabaseService = inject(SupabaseService);
  public topProducts = signal<ITopProduct[]>([]);

  public ngOnInit(): void {
    const data = this.supabaseService.topProducts();
    if (!data) return;
    this.topProducts.set(data);
  }
}
