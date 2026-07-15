import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { passwordMatchValidator } from './validators';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordComponent {
  private supabaseService = inject(SupabaseService);
  public isValidPassword = signal<boolean>(true);
  private router = inject(Router);
  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public form = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/),
      ]),
      agree: new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: passwordMatchValidator },
  );

  public onVisiblePassword(): void {
    this.isValidPassword.update((prev) => !prev);
  }

  public async onSubmit(): Promise<void> {
    const newPassword = this.form.value.newPassword;
    if (this.form.invalid) {
      this.showModal(
        'error',
        'Пожалуйста, корректно заполните все поля формы. Пароль должен содержать латинские буквы, цифры и быть не менее 8 символов.',
      );
      console.log(this.form);

      return;
    }
    if (!newPassword) return;
    try {
      await this.supabaseService.updatePassword(newPassword);
      await this.supabaseService.signOut();
      this.router.navigate(['/auth/login']);

      this.showModal(
        'success',
        'Ваш пароль был успешно изменен. Теперь вы можете войти в систему с новыми данными.',
      );
    } catch (err) {
      console.error(err);
      this.showModal(
        'error',
        'Не удалось изменить пароль. Попробуйте ещё раз или запросите новую ссылку восстановления.',
      );
    }
  }
}
