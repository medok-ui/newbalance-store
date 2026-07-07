import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private supabaseService = inject(SupabaseService);
  private route = inject(Router);

  public visiblePassword = signal<boolean>(true);

  public isValidLogin = signal<boolean>(true)
  public isValidPassword = signal<boolean>(true)

  public onVisiblePassword(): void {
    this.visiblePassword.update((prev) => !prev);
  }

  public form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/),
    ]),
  });

  public async onSubmit(): Promise<void> {
    this.isValidLogin.set(this.form.controls.email.valid);
    this.isValidPassword.set(this.form.controls.password.valid);

    if (this.form.valid) {
      const email = this.form.controls.email.value;
      const password = this.form.controls.password.value;
      if (!email || !password) return;
      await this.supabaseService.signIn(email, password);
      this.route.navigate(['/profile/']);
    }
  }
}
