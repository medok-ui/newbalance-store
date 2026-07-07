import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { IProduct } from '../../../products/interfaces/product.interface';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import { ProductSpecsComponent } from './components/product-specs/product-specs.component';

@Component({
  selector: 'app-product-tabs',
  imports: [ProductDescriptionComponent, ProductSpecsComponent],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTabsComponent {
  public product = input.required<IProduct | null>();
  public currentPanel = signal<'desk' | 'characteristics' | 'reviews'>('desk');

  public showDescription(): void {
    this.currentPanel.set('desk');
  }
  public showCharacteristics(): void {
    this.currentPanel.set('characteristics');
  }
}
