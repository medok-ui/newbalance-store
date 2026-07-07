import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-product-description',
  imports: [],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionComponent {
  public descriptionProduct = input.required<IProduct | null>();
}
