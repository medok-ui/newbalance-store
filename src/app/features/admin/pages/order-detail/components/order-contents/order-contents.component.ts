import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-order-contents',
  imports: [PriceFormatPipe],
  templateUrl: './order-contents.component.html',
  styleUrl: './order-contents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderContentsComponent {
  public order = input.required<IOrder | null>();
}
