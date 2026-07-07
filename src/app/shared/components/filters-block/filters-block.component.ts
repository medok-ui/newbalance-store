import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FilterService } from '../../../core/services/filter.service';
import { FILTER_SECTIONS } from './filters-block.constants';

@Component({
  selector: 'app-filters-block',
  imports: [],
  templateUrl: './filters-block.component.html',
  styleUrl: './filters-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersBlockComponent {
  public filterService = inject(FilterService);
  public exclude = input<string[]>([]);
  
  public filterSections = computed(() => {
    const excluded = this.exclude();
    return FILTER_SECTIONS.filter((s) => !excluded.includes(s.id));
  });

  public openedSections = signal<Record<string, boolean>>({
    sort: true,
    gender: true,
    sizes: true,
    price: true,
    badge: true,
    rating: true,
  });

  public toggleVisible(id: string): void {
    this.openedSections.update((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  public sortProducts(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterService.sortProduct.set(value);
  }

  public filterGender(gender: string): void {
    const current = this.filterService.filterGender();
    this.filterService.filterGender.set(current === gender ? '' : gender);
  }

  public filterSize(size: string): void {
    this.filterService.filterSizes.update((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }

  public filterMinPrice(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterService.filterMinPrice.set(Number(value));
  }

  public filterMaxPrice(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterService.filterMaxPrice.set(Number(value));
  }

  public filterBadge(badge: string): void {
    console.log(badge);
    this.filterService.filterBadge.set(badge as 'all' | 'new' | 'sale');
  }

  public filterRating(rating: string): void {
    const numRating = Number(rating);
    const current = this.filterService.filterRating();
    this.filterService.filterRating.set(current === numRating ? 0 : numRating);
  }

  public resetFilters(): void {
    this.filterService.filterGender.set('');
    this.filterService.filterSizes.set([]);
    this.filterService.filterMinPrice.set(0);
    this.filterService.filterMaxPrice.set(0);
    this.filterService.filterBadge.set('all');
    this.filterService.filterRating.set(0);
    this.filterService.isFiltered.set(false);
  }
}
