import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private supabaseService = inject(SupabaseService);
  public isSubmit = signal<boolean>(false);
  public currentEmail = signal<string>('');

  private readonly TIMER_DURATION = 60;
  public timeRemaining = signal(this.TIMER_DURATION);
  private isRunning = signal(false);

  private intervalId?: ReturnType<typeof setInterval>;

  public form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
  });

  public startTimer(): void {
    if (this.isRunning()) return;
    this.isRunning.set(true);

    this.timeRemaining.set(this.TIMER_DURATION);
    this.isRunning.set(true);

    this.intervalId = setInterval(() => {
      this.timeRemaining.update((time) => {
        if (time <= 1) {
          this.clearTimer();
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  }

  public clearTimer() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.isSubmit() && this.isRunning()) return;
    const email = this.form.value.email;

    if (!email) return;
    try {
      await this.supabaseService.resetPassword(email);
      this.currentEmail.set(email);
      this.isSubmit.set(true);
      this.startTimer();
    } catch (err) {
      console.error(err);
    }
  }
}
