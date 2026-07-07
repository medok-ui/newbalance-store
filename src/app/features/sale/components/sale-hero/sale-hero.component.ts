import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-sale-hero',
  imports: [],
  templateUrl: './sale-hero.component.html',
  styleUrl: './sale-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleHeroComponent implements OnInit, OnDestroy {
  public supabaseService = inject(SupabaseService);
  public saleProducts = input.required<IProduct[]>();

  private targetDate = new Date('2027-06-16T00:00:00');
  private intervalId?: ReturnType<typeof setInterval>;

  public timeLeft = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  public discountedProducts = computed(() => {
    const allProducts = this.saleProducts();
    const saleProducts = allProducts.filter((product) => product.discount! > 0);
    const maxDiscount = Math.max(...saleProducts.map((product) => product.discount!));

    return maxDiscount;
  });

  private updateTimer(): void {
    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const diff = target - now;

    if (diff <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.timeLeft.set({ days, hours, minutes, seconds });
  }

  public ngOnInit(): void {
    this.updateTimer();
    this.intervalId = setInterval(() => this.updateTimer(), 1000);
  }

  public ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
