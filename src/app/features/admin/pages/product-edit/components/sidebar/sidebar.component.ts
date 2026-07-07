import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-sidebar',
  imports: [ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public product = input.required<IProduct | undefined>();

  public form = new FormGroup({
    price: new FormControl('', [Validators.required]),
    oldPrice: new FormControl('', [Validators.required]),
    discount: new FormControl('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        price: this.product()?.price.toString(),
        oldPrice: this.product()?.old_price!.toString(),
        discount: this.product()?.discount!.toString(),
      });
    });
  }

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calculateDiscount();
      });
  }

  private calculateDiscount(): void {
    const price = Number(this.form.controls.price.value);
    const oldPrice = Number(this.form.controls.oldPrice.value);

    if (!price || !oldPrice || oldPrice <= price) {
      this.form.controls.discount.setValue('');
      return;
    }

    const discountPercentage = Math.round(((oldPrice - price) / oldPrice) * 100);
    this.form.controls.discount.setValue(String(discountPercentage));
  }
}
