import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-information',
  imports: [ReactiveFormsModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  public form = new FormGroup({
    descMain: new FormControl('', [Validators.required]),
    descFeatures: new FormControl('', [Validators.required]),
    descTech: new FormControl('', [Validators.required]),
    descAbout: new FormControl('', [Validators.required]),
  });
}
