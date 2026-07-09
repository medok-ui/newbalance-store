import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ProductSearchComponent } from '../../../features/products/components/product-search/product-search.component';
import { IProduct } from '../../../features/products/interfaces/product.interface';
import { ISearchTag, SEARCH_TAGS } from './search-block.constants';

@Component({
  selector: 'app-search-block',
  imports: [ReactiveFormsModule, ProductSearchComponent],
  templateUrl: './search-block.component.html',
  styleUrl: './search-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBlockComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private supabaseService = inject(SupabaseService);
  public products = signal<IProduct[]>([]);

  public isSearching = signal<boolean>(false);
  public isEmpty = signal<boolean>(false);
  public searchTags = signal<ISearchTag[]>(SEARCH_TAGS);

  public closeSearch = output<void>();

  public onProductClick(): void {
    this.closeSearch.emit();
  }

  public searchInput = new FormControl('', { validators: [Validators.required] });

  public ngOnInit(): void {
    this.searchInput.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const trimmedValue = value?.trim();

      if (!trimmedValue) {
        this.isSearching.set(false);
        this.isEmpty.set(false);
        this.products.set([]);
        return;
      }

      const allProducts = this.supabaseService.products();
      const sortedProducts = allProducts
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((product) => product.name.toLowerCase().includes(trimmedValue.toLowerCase()));

      this.isSearching.set(true);
      this.isEmpty.set(sortedProducts.length === 0);
      this.products.set(sortedProducts);
    });
  }

  public onReset(): void {
    this.searchInput.reset();
  }

  public onTag(tag: string): void {
    this.searchInput.setValue(tag);
  }
}
