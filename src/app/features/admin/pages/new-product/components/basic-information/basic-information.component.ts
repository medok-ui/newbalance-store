import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-information',
  imports: [ReactiveFormsModule],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicInformationComponent {
  public form = new FormGroup({
    title: new FormControl('Кроссовки New Balance', [Validators.required]),
    brand: new FormControl('New Balance', [Validators.required]),
    category: new FormControl('Беговые', [Validators.required]),
    gender: new FormControl('Унисекс', [Validators.required]),
    tag: new FormControl('none', [Validators.required]),
  }); 
}
