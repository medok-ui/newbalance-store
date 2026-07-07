import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-basic-information',
  imports: [ReactiveFormsModule],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicInformationComponent {
  public product = input.required<IProduct | undefined>();

  public form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    tag: new FormControl('none', [Validators.required]),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        title: this.product()?.name ?? '—',
        brand: this.product()?.brand ?? '—',
        category: this.product()?.categories?.slug ?? '—',
        gender: this.product()?.gender ?? '—',
        tag: this.product()?.badge ?? 'none',
      });
    });
  }
}
