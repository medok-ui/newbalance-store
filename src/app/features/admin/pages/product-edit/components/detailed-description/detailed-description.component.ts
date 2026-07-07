import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-detailed-description',
  imports: [ReactiveFormsModule],
  templateUrl: './detailed-description.component.html',
  styleUrl: './detailed-description.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedDescriptionComponent {
  public product = input.required<IProduct | undefined>();

  public form = new FormGroup({
    descMain: new FormControl('', [Validators.required]),
    descFeatures: new FormControl('', [Validators.required]),
    descTech: new FormControl('', [Validators.required]),
    descAbout: new FormControl('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        descMain: this.product()?.description.intro ?? '—',
        descFeatures: this.product()?.description.features ?? '—',
        descTech: this.product()?.description.technologies ?? '—',
        descAbout: this.product()?.description.about ?? '—',
      });
    });
  }
}
