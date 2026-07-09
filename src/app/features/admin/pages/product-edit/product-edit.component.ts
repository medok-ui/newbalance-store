import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { IProduct } from '../../../products/interfaces/product.interface';
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { CharacteristicsComponent } from './components/characteristics/characteristics.component';
import { DetailedDescriptionComponent } from './components/detailed-description/detailed-description.component';
import { PhotosComponent } from './components/photos/photos.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SizesComponent } from './components/sizes/sizes.component';

@Component({
  selector: 'app-product-edit',
  imports: [
    DetailedDescriptionComponent,
    SidebarComponent,
    PhotosComponent,
    SizesComponent,
    BasicInformationComponent,
    CharacteristicsComponent,
    ModalComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent {
  private activatedRoute = inject(ActivatedRoute);
  public supabaseService = inject(SupabaseService);

  public productId = toSignal(
    this.activatedRoute.params.pipe(map((params) => Number(params['id']))),
  );

  private basicInfo = viewChild.required(BasicInformationComponent);
  private characteristics = viewChild.required(CharacteristicsComponent);
  private detailDesc = viewChild.required(DetailedDescriptionComponent);
  private photos = viewChild.required(PhotosComponent);
  private sidebar = viewChild.required(SidebarComponent);
  private sizesRef = viewChild.required(SizesComponent);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public currentProduct = computed(() => {
    const products = this.supabaseService.products();
    return products.find((p) => p.id === this.productId());
  });

  public async onSubmit(): Promise<void> {
    this.showModal('wait', 'Сохраняем изменения...');

    if (
      !this.basicInfo().form.valid ||
      !this.characteristics().form.valid ||
      !this.detailDesc().form.valid ||
      !this.sidebar().form.valid
    ) {
      this.showModal('error', 'Форма не валидна. Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const basicInfo = this.basicInfo().form.getRawValue();
    const characteristics = this.characteristics().form.getRawValue();
    const sidebar = this.sidebar().form.getRawValue();
    const detailDesc = this.detailDesc().form.getRawValue();
    const sizes = this.sizesRef().sizes();

    if (sizes.length === 0) {
      this.showModal('error', 'Добавьте размеры в наличии.');
      return;
    }

    let imageUrls: string[] = [];
    try {
      imageUrls = await this.photos().getFinalImageUrls();
    } catch {
      this.showModal('error', 'Не удалось загрузить фото');
      return;
    }

    const product: Partial<Omit<IProduct, 'id' | 'created_at' | 'categories'>> = {
      name: basicInfo.title ?? '',
      brand: basicInfo.brand ?? '',
      category_id: 3,
      gender: basicInfo.gender ?? '',
      badge: basicInfo.tag === 'none' ? null : (basicInfo.tag as 'new' | 'sale' | null),
      price: Number(sidebar.price) || 0,
      old_price: sidebar.oldPrice ? Number(sidebar.oldPrice) : null,
      discount: sidebar.discount ? Number(sidebar.discount) : null,
      description: {
        intro: detailDesc.descMain ?? '',
        features: detailDesc.descFeatures ?? '',
        technologies: detailDesc.descTech ?? '',
        about: detailDesc.descAbout ?? '',
      },
      specs: {
        upper: characteristics.up ?? '',
        sole: characteristics.sole ?? '',
        midsole: characteristics.midsole ?? '',
        weight: characteristics.mass ?? '',
        closure: characteristics.clasp ?? '',
        height: characteristics.height ?? '',
        country: characteristics.country ?? '',
        color: characteristics.color ?? '',
        size_range: sizes.length > 0 ? `${sizes[0]}-${sizes[sizes.length - 1]}` : '',
        warranty: '30 дней',
      },
      sizes: sizes.map(Number),
      images: imageUrls,
      rating: this.currentProduct()?.rating,
      reviews_count: this.currentProduct()?.reviews_count,
      in_stock: true,
    };

    try {
      await this.supabaseService.updateProduct(this.productId()!, product);
      this.showModal('success', 'Товар успешно обновлён');
    } catch {
      this.showModal('error', 'Не удалось сохранить изменения');
    }
  }
}
