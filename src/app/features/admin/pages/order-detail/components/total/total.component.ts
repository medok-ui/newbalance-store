import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-total',
  imports: [PriceFormatPipe],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalComponent {
  public order = input.required<IOrder | null>();
  constructor() {
    effect(() => {
      console.log(this.order());
    });
  }
}
