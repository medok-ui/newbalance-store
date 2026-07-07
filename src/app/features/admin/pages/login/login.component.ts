import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  public visiblePassword = signal<boolean>(true);

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
    if (this.form.valid) {
      const email = this.form.value.email;
      const password = this.form.value.password;
      if (!email || !password) return;

      await this.supabaseService.signIn(email, password);
      const admin = await this.supabaseService.isAdmin();

      if (!admin) {
        await this.supabaseService.signOut();
        return;
      }
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
