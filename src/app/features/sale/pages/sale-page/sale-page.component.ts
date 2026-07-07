import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IProduct } from '../../../products/interfaces/product.interface';
import { SaleGridComponent } from '../../components/sale-grid/sale-grid.component';
import { SaleHeroComponent } from '../../components/sale-hero/sale-hero.component';

@Component({
  selector: 'app-sale-page',
  imports: [SaleHeroComponent, SaleGridComponent],
  templateUrl: './sale-page.component.html',
  styleUrl: './sale-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalePageComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public products = signal<IProduct[]>([]);

  public ngOnInit(): void {
    const allProducts = this.supabaseService.products();
    const saleProducts = allProducts.filter((product) => product.badge === 'sale');
    this.products.set(saleProducts);
  }
}
