import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CartService } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorites.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, ModalComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private supabaseService = inject(SupabaseService);
  private route = inject(Router);
  private favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);

  public visiblePassword = signal<boolean>(true);

  public isValidLogin = signal<boolean>(true);
  public isValidPassword = signal<boolean>(true);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

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

    if (!this.form.valid) {
      this.showModal(
        'error',
        'Введите корректный email. Пароль должен содержать минимум 8 символов, заглавную и строчную буквы, а также цифру',
      );
      return;
    }

    const email = this.form.controls.email.value;
    const password = this.form.controls.password.value;
    if (!email || !password) return;

    try {
      await this.supabaseService.signIn(email, password);
      await Promise.all([
        this.supabaseService.getUser(),
        this.cartService.getCart(),
        this.favoritesService.getCart(),
        this.supabaseService.getOrders(),
      ]);

      this.route.navigate(['/profile/']);
    } catch (err) {
      this.showModal('error', 'Не удалось выполнить вход. Попробуйте ещё раз');
      console.error(err);
    }
  }
}
