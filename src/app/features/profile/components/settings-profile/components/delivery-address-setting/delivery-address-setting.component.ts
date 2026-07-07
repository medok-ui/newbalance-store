import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { IUserProfile } from './../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-delivery-address-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './delivery-address-setting.component.html',
  styleUrl: './delivery-address-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressSettingComponent {
  private supabaseService = inject(SupabaseService);

  public currentUser = signal<IUserProfile | null>(null);

  public form = new FormGroup({
    city: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[а-яёА-ЯЁa-zA-Z\s\-]{2,50}$/),
    ]),
    index: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[а-яёА-ЯЁa-zA-Z0-9\s\.\,\-\/]{5,100}$/),
    ]),
  });

  public async ngOnInit(): Promise<void> {
    const data = await this.supabaseService.getUser();
    if (!data) return;
    this.currentUser.set(data);

    this.form.patchValue({
      city: data.city ?? '',
      index: data.postal_code ?? '',
      address: data.address ?? '',
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const city = this.form.value.city;
      const index = this.form.value.index;
      const address = this.form.value.address;
      if (!city || !index || !address) return;
      console.log('Submit');

      this.supabaseService.updateDeliveryAddress(city, address, index);
    }
  }
}
