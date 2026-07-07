import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-characteristics',
  imports: [ReactiveFormsModule],
  templateUrl: './characteristics.component.html',
  styleUrl: './characteristics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicsComponent {
  public product = input.required<IProduct | undefined>();
  public form = new FormGroup({
    up: new FormControl('', [Validators.required]),
    sole: new FormControl('', [Validators.required]),
    midsole: new FormControl('', [Validators.required]),
    mass: new FormControl('', [Validators.required]),
    clasp: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        up: this.product()?.specs.upper,
        sole: this.product()?.specs.sole,
        midsole: this.product()?.specs.midsole,
        mass: this.product()?.specs.weight,
        clasp: this.product()?.specs.closure,
        height: this.product()?.specs.height,
        country: this.product()?.specs.country,
        color: this.product()?.specs.color,
      });
    });
  }
}
