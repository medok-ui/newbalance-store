import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardMiniComponent } from '../product-card-mini/product-card-mini.component';
import { SupabaseService } from './../../../../core/services/supabase.service';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCardMiniComponent, RouterLink],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridComponent {
  public supabaseService = inject(SupabaseService);
  public productSlices = computed(() => this.supabaseService.products().slice(0, 4));
}
