import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public isShowFilters = signal<boolean>(false);

  public isFiltered = signal<boolean>(false);

  public sortProduct = signal<string>('');
  public filterGender = signal<string>('');
  public filterSizes = signal<string[]>([]);
  public filterMinPrice = signal<number>(0);
  public filterMaxPrice = signal<number>(0);
  public filterBadge = signal<'all' | 'new' | 'sale'>('all');
  public filterRating = signal<number>(0);

  public onShowFilters(): void {
    this.isShowFilters.update((value) => !value);
  }
}
