import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-sizes',
  imports: [],
  templateUrl: './sizes.component.html',
  styleUrl: './sizes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizesComponent {
  public sizes = signal<string[]>([]);

  public addSize(event: Event): void {
    event.preventDefault();
    const size = (event.target as HTMLInputElement).value.trim();
    if (!size) return;
    this.sizes.update((currentSizes) => [...currentSizes, size]);
    (event.target as HTMLInputElement).value = '';
  }

  public deleteSize(size: string): void {
    this.sizes.update((currentSizes) => currentSizes.filter((s) => s !== size));
  }
}
