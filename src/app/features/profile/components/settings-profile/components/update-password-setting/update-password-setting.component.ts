import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';

@Component({
  selector: 'app-update-password-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './update-password-setting.component.html',
  styleUrl: './update-password-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordSettingComponent {
  private supabaseService = inject(SupabaseService);
  public visiblePassword = signal<boolean>(true);

  public form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)[A-Za-zА-Яа-яЁё\d]{8,}$/),
    ]),
  });

  public onVisiblePassword(): void {
    this.visiblePassword.update((prev) => !prev);
  }

  public async onSubmit(): Promise<void> {
    if (this.form.valid) {
      const newPassword = this.form.value.password;
      if (!newPassword) return;
      await this.supabaseService.updatePassword(newPassword);
      this.form.reset();
    }
  }
}
