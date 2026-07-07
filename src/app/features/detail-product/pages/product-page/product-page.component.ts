import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { IProduct } from '../../../products/interfaces/product.interface';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { ProductTabsComponent } from '../../components/product-tabs/product-tabs.component';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-product-page',
  imports: [RouterLink, ProductGalleryComponent, ProductInfoComponent, ProductTabsComponent, ModalComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent {
  private route = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseService);

  // превращаем Observable в сигнал через toSignal. toSignal сам отписывается при уничтожении компонента, поэтому не нужно использовать takeUntilDestroyed
  private productId = toSignal(this.route.params.pipe(map((params) => Number(params['id']))));

  public product = signal<IProduct | null>(null);
  public loadingText = signal<string>('');

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  constructor() {
    effect(() => {
      const id = this.productId();
      if (!id) return;

      this.loadProduct(id);
    });
  }

  private async loadProduct(id: number) {
    try {
      const localProducts = await this.supabaseService.products();
      const foundLocal = localProducts.find((p) => p.id === id);

      if (foundLocal) {
        this.product.set(foundLocal);
      } else {
        const fetchedProduct = await this.supabaseService.loadProductById(id);
        this.product.set(fetchedProduct);
      }
    } catch (error) {
      this.showModal('error', `Ошибка загрузки продуктов: ${error}`)
    }
  }
}
