import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { IProduct } from '../../../../../products/interfaces/product.interface';

@Component({
  selector: 'app-sizes',
  imports: [],
  templateUrl: './sizes.component.html',
  styleUrl: './sizes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizesComponent implements OnInit {
  public product = input.required<IProduct | undefined>();

  public sizes = signal<number[]>([]);


  public ngOnInit(): void {
    const currentSizes = this.product()?.sizes;
    if (!currentSizes) return;
    this.sizes.set(currentSizes);
  }

  public addSize(event: Event): void {
    event.preventDefault();
    const size = (event.target as HTMLInputElement).value.trim();
    this.sizes.update((sizes) => [...sizes, Number(size)]);
    (event.target as HTMLInputElement).value = '';
  }

  public deleteSize(currentSize: number): void {
    this.sizes.update((sizes) => sizes.filter((size) => size !== currentSize));
  }
}
