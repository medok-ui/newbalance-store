import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FOOTER_NAVIGATION, IFooterColumn } from './footer.constants';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly footerNavigation = signal<IFooterColumn[]>(FOOTER_NAVIGATION);
  public isFormValid = signal<boolean>(false);
  public formSubmitMessage = signal<string>('Неверный формат. Пример: name@example.com');
  public isSubmit = signal<boolean>(false);

  public form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
  });

  public onSubmit(): void {
    if (this.form.valid) {
      this.isFormValid.set(false);
      this.isSubmit.set(true);
      return this.form.reset();
    }
    this.isFormValid.set(true);
  }
}
