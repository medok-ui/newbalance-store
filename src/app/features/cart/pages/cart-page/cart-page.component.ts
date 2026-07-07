import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartDrawerComponent } from "../../components/cart-drawer/cart-drawer.component";

@Component({
  selector: 'app-cart-page',
  imports: [CartDrawerComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {

}
