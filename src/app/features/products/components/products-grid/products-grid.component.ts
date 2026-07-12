import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IProduct } from '../../interfaces/product.interface';
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
  private breakpointObserver = inject(BreakpointObserver);
  public supabaseService = inject(SupabaseService);
  private destroy$ = new Subject<void>();

  public productSlices = signal<IProduct[]>([]);

  constructor() {
    effect(() => {
      this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (state: BreakpointState) => {
            if (state.matches) {
              this.productSlices.set(this.supabaseService.products().slice(0, 2));
              return; 
            }
            this.productSlices.set(this.supabaseService.products().slice(0, 4));
          },
        });
    });
  }
}
