import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-update-password-setting',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './update-password-setting.component.html',
  styleUrl: './update-password-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordSettingComponent {
  private supabaseService = inject(SupabaseService);
  public visiblePassword = signal<boolean>(true);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/),
    ]),
  });

  public onVisiblePassword(): void {
    this.visiblePassword.update((prev) => !prev);
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.showModal(
        'error',
        'Пароль не соответствует требованиям безопасности:\n' +
          '• Длина — от 8 символов\n' +
          '• Обязательно: минимум одна заглавная буква, одна строчная и одна цифра\n' +
          '• Пример правильного пароля: Secret7Word, НовыйПароль2026',
      );
      return;
    }

    const newPassword = this.form.value.password;
    if (!newPassword) return;
    try {
      await this.supabaseService.updatePassword(newPassword);

      this.showModal(
        'success',
        'Пароль успешно изменен!\n' + 'Новые данные сохранены, используйте их при следующем входе.',
      );
      this.form.reset();
    } catch (error) {
      this.showModal('error', 'Не удалось обновить пароль. Попробуйте позже.');
    }
  }
}
