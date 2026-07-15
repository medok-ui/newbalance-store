import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-order-card',
  imports: [RouterLink, DatePipe, PriceFormatPipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent {
  public order = input.required<IOrder>();

  ngOnInit() {
    console.log(this.order());
  }
}
