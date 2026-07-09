import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { IUserProfile } from './../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-delivery-address-setting',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './delivery-address-setting.component.html',
  styleUrl: './delivery-address-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressSettingComponent {
  private supabaseService = inject(SupabaseService);

  public currentUser = signal<IUserProfile | null>(null);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public form = new FormGroup({
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[а-яёА-ЯЁa-zA-Z\s\-]+$/),
    ]),
    index: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    address: new FormControl('', [
      Validators.required,
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(150),
    ]),
  });

  public ngOnInit(): void {
    const data = this.supabaseService.infoCurrentUser();
    if (!data) {
      this.showModal('error', 'Что то пошло не так.');
      return;
    }
    this.currentUser.set(data);

    this.form.patchValue({
      city: data.city ?? '',
      index: data.postal_code ?? '',
      address: data.address ?? '',
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.showModal(
        'error',
        'Пожалуйста, проверьте правильность заполнения адреса доставки:\n' +
          '• Город — только буквы (например: Москва, Санкт-Петербург)\n' +
          '• Индекс — ровно 6 цифр (например: 101000)\n' +
          '• Адрес — улица, дом, квартира (например: ул. Ленина, д. 12, кв. 45)',
      );
      return;
    }

    const city = this.form.value.city;
    const index = this.form.value.index;
    const address = this.form.value.address;
    if (!city || !index || !address) return;
    console.log('Submit');

    this.supabaseService.updateDeliveryAddress(city, address, index);
    
    this.showModal(
      'success',
      'Данные успешно сохранены!\n' +
        'Адрес доставки обновлен. Мы будем использовать его для ваших следующих заказов.',
    );
  }
}
