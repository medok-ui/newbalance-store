import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private supabaseService = inject(SupabaseService);
  private route = inject(Router);

  public visiblePassword = signal<boolean>(true);

  public isValidLogin = signal<boolean>(true)
  public isValidPassword = signal<boolean>(true)
  public isValidFirstName = signal<boolean>(true)
  public isValidLastName = signal<boolean>(true)

  public onVisiblePassword(): void {
    this.visiblePassword.update((prev) => !prev);
  }

  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/),
    ]),
    agree: new FormControl(false, [Validators.requiredTrue]),
  });

  public async onSubmit(): Promise<void> {
    this.isValidLogin.set(this.form.controls.email.valid);
    this.isValidPassword.set(this.form.controls.password.valid);
    this.isValidFirstName.set(this.form.controls.firstName.valid);
    this.isValidLastName.set(this.form.controls.lastName.valid);


    if (this.form.valid) {
      const email = this.form.controls.email.value;
      const password = this.form.controls.password.value;
      const lastName = this.form.controls.lastName.value;
      const firstName = this.form.controls.firstName.value;
      if (!email || !password || !lastName || !firstName) return;
      await this.supabaseService.signUp(email, password, firstName, lastName);
      this.route.navigate(['/auth/login']);
    }
  }
}
