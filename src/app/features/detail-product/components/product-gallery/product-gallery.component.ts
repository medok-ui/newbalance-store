import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { IProduct } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-product-gallery',
  imports: [],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGalleryComponent {
  public product = input.required<IProduct | null>();
  public currentImage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const initialImg = this.product()?.images[0];
      if (initialImg) {
        this.currentImage.set(initialImg);
      }
    });
  }

  public showMainImage(img: string): void {
    this.currentImage.set(img);
  }
}
