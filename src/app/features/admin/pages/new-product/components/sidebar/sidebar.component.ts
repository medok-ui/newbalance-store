import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit{
  private destroyRef = inject(DestroyRef);

  public form = new FormGroup({
    price: new FormControl('8500', [Validators.min(8500), Validators.required]),
    oldPrice: new FormControl('13000', [Validators.required]),
    discount: new FormControl('', [Validators.min(0), Validators.max(100), Validators.required]),
  });

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
