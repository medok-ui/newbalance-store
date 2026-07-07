import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/product.interface';
import { PriceFormatPipe } from '../../../../core/pipes/price-format.pipe';

@Component({
  selector: 'app-product-search',
  imports: [RouterLink, PriceFormatPipe],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchComponent {
  public products = input.required<IProduct>();
}
