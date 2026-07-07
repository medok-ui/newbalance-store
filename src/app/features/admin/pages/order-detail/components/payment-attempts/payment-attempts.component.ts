import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PriceFormatPipe } from '../../../../../../core/pipes/price-format.pipe';
import { IOrder } from '../../../../../../shared/interfaces/order.interface';
import { CdkCopyToClipboard } from "@angular/cdk/clipboard";

@Component({
  selector: 'app-payment-attempts',
  imports: [DatePipe, PriceFormatPipe, CdkCopyToClipboard],
  templateUrl: './payment-attempts.component.html',
  styleUrl: './payment-attempts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAttemptsComponent {
  public order = input.required<IOrder | null>();
}
