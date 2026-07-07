import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-new-arrivals-hero',
  imports: [],
  templateUrl: './new-arrivals-hero.component.html',
  styleUrl: './new-arrivals-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArrivalsHeroComponent {
  public newArrivalsProducts = input.required<IProduct[]>();
}
