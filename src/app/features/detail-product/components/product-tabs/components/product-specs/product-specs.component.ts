import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { IProduct } from '../../../../../products/interfaces/product.interface';
import { SPECS_LABELS, TProductSpecsLabels } from './product-specs.labels';

@Component({
  selector: 'app-product-specs',
  imports: [],
  templateUrl: './product-specs.component.html',
  styleUrl: './product-specs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSpecsComponent {
  public specsProduct = input.required<IProduct | null | undefined>();
  public labelsSpecs = signal<TProductSpecsLabels>(SPECS_LABELS);

  public specsKeys = Object.keys(SPECS_LABELS) as (keyof TProductSpecsLabels)[];
}
