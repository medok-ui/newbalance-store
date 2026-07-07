import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductsGridComponent } from '../../products/components/products-grid/products-grid.component';
import { HeroComponent } from '../components/hero/hero.component';
import { PromoBannerComponent } from '../components/promo-banner/promo-banner.component';

@Component({
  selector: 'app-pages',
  imports: [HeroComponent, ProductsGridComponent, PromoBannerComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {}
