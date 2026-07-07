import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ITopProduct } from '../../../../shared/interfaces/top-product.interface';
import { RouterLink } from "@angular/router";

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

  public async ngOnInit(): Promise<void> {
    const data = await this.supabaseService.getTopProducts(10);
    this.topProducts.set(data);
  }
}
