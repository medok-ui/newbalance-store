import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IProduct } from '../../../products/interfaces/product.interface';
import { NewArrivalsGridComponent } from '../../components/new-arrivals-grid/new-arrivals-grid.component';
import { NewArrivalsHeroComponent } from '../../components/new-arrivals-hero/new-arrivals-hero.component';

@Component({
  selector: 'app-new-arrivals',
  imports: [NewArrivalsHeroComponent, NewArrivalsGridComponent],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArrivalsComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  public products = signal<IProduct[]>([]);

  public ngOnInit(): void {
    const allProducts = this.supabaseService.products();
    const newArrivals = allProducts.filter((product) => product.badge === 'new');
    this.products.set(newArrivals);
  }
}
