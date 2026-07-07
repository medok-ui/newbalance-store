import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterService } from '../../../../core/services/filter.service';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { FiltersBlockComponent } from '../../../../shared/components/filters-block/filters-block.component';
import { ProductCatalogCardComponent } from '../../../products/components/product-catalog-card/product-catalog-card.component';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-sale-grid',
  imports: [FiltersBlockComponent, ProductCatalogCardComponent, RouterLink],
  templateUrl: './sale-grid.component.html',
  styleUrl: './sale-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleGridComponent {
  public filterService = inject(FilterService);
  public supabaseService = inject(SupabaseService);
  public saleProducts = input.required<IProduct[]>();

  public products = computed(() => {
    const allProducts = this.saleProducts();
    if (!allProducts || allProducts.length === 0) return [];

    const filterBadge = this.filterService.filterBadge();
    const filterGender = this.filterService.filterGender();
    const filterMaxPrice = this.filterService.filterMaxPrice();
    const filterMinPrice = this.filterService.filterMinPrice();
    const filterRating = this.filterService.filterRating();
    const filterSizes = this.filterService.filterSizes();
    const sortBy = this.filterService.sortProduct();

    const filteredProducts = allProducts.filter((item) => {
      if (filterGender && item.gender !== filterGender) return false;

      if (filterBadge !== 'all' && item.badge !== filterBadge) return false;
      if (filterMinPrice > 0 && item.price < filterMinPrice) return false;
      if (filterMaxPrice > 0 && item.price > filterMaxPrice) return false;
      if (filterRating > 0 && item.rating < filterRating) return false;

      if (filterSizes.length > 0) {
        const hasSelectedSize = item.sizes?.some((size) => filterSizes.includes(size.toString()));
        if (!hasSelectedSize) return false;
      }
      return true;
    });

    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'Сначала дешёвые':
          return a.price - b.price;
        case 'Сначала дорогие':
          return b.price - a.price;
        case 'По рейтингу':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  });
}
