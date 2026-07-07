import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSuccessComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseService);
  private cartService = inject(CartService);

  public orderId = signal<string>('');
  public userName = signal<string>('');
  public userEmail = signal<string>('');

  public async ngOnInit(): Promise<void> {
    const orderId = this.activatedRoute.snapshot.queryParams['order'];
    if (!orderId) return;

    this.orderId.set(orderId);

    await this.supabaseService.updateOrderStatus(orderId, 'paid');
    const user = await this.supabaseService.getUser();
    const authUser = this.supabaseService.currentUser();

    this.userName.set(user?.first_name ?? '');
    this.userEmail.set(authUser?.email ?? '');

    await this.cartService.clearCart();
  }
}
