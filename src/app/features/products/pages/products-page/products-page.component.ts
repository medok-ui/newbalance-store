import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilterService } from '../../../../core/services/filter.service';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { FiltersBlockComponent } from '../../../../shared/components/filters-block/filters-block.component';
import { ProductCatalogCardComponent } from '../../components/product-catalog-card/product-catalog-card.component';

@Component({
  selector: 'app-products-page',
  imports: [RouterLink, ProductCatalogCardComponent, FiltersBlockComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseService);
  private destroyRef = inject(DestroyRef);
  public filterService = inject(FilterService);

  public isGenderNeutral = signal<'mens' | 'womens' | 'unisex'>('unisex');

  public products = computed(() => {
    const allProducts = this.supabaseService.products();
    const currentGender = this.isGenderNeutral();
    if (!allProducts || allProducts.length === 0) return [];

    const filterBadge = this.filterService.filterBadge()
    const filterGender = this.filterService.filterGender();
    const filterMaxPrice = this.filterService.filterMaxPrice()
    const filterMinPrice = this.filterService.filterMinPrice()
    const filterRating = this.filterService.filterRating()
    const filterSizes = this.filterService.filterSizes();
    const sortBy = this.filterService.sortProduct();

    const filteredProducts = allProducts.filter((item) => {
      if (currentGender === 'mens' && item.gender !== 'Мужской') return false;
      if (currentGender === 'womens' && item.gender !== 'Женский') return false;
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
    })

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

  public ngOnInit(): void {
    this.activeRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const gender = params['gender'] as 'mens' | 'womens' | undefined;
      this.isGenderNeutral.set(gender ?? 'unisex');
    });
  }
}
