import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';
import { CdkCopyToClipboard } from "@angular/cdk/clipboard";

@Component({
  selector: 'app-buyer',
  imports: [DatePipe, CdkCopyToClipboard],
  templateUrl: './buyer.component.html',
  styleUrl: './buyer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerComponent {
  public order = input.required<IOrder | null>();
}
