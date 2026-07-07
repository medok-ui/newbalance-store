import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-characteristics',
  imports: [ReactiveFormsModule],
  templateUrl: './characteristics.component.html',
  styleUrl: './characteristics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicsComponent {
  public form = new FormGroup({
    material: new FormControl('', [Validators.required]),
    sole: new FormControl('', [Validators.required]),
    midsole: new FormControl('', [Validators.required]),
    mass: new FormControl('', [Validators.required]),
    clasp: new FormControl('', [Validators.required]),
    height: new FormControl('Low (низкий берец)', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
  });
}
