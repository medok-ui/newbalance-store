import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';

@Component({
  selector: 'app-total',
  imports: [PriceFormatPipe],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalComponent {
  public order = input.required<IOrder | null>();
}
