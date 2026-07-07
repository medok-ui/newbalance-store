import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-promo-banner',
  imports: [RouterLink],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBannerComponent {}
