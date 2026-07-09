import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-recipient',
  imports: [ReactiveFormsModule],
  templateUrl: './recipient.component.html',
  styleUrl: './recipient.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private checkoutService = inject(CheckoutService);

  public from = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/),
    ]),
  });

  public  ngOnInit(): void {
    const data = this.supabaseService.infoCurrentUser();
    const emailUser = this.supabaseService.currentUser();

    this.from.patchValue({
      firstName: data?.first_name ?? '',
      lastName: data?.last_name ?? '',
      email: emailUser?.email ?? '',
      phone: data?.phone ?? '',
    });

    this.checkoutService.isCheckoutUserDataValid.set(this.from.valid);
  }
}
