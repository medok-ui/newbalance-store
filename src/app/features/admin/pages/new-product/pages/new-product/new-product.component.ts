import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { IProduct } from '../../../../../products/interfaces/product.interface';
import { BasicInformationComponent } from '../../components/basic-information/basic-information.component';
import { CharacteristicsComponent } from '../../components/characteristics/characteristics.component';
import { InformationComponent } from '../../components/information/information.component';
import { PhotosComponent } from '../../components/photos/photos.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SizesComponent } from '../../components/sizes/sizes.component';

@Component({
  selector: 'app-new-product',
  imports: [
    BasicInformationComponent,
    CharacteristicsComponent,
    PhotosComponent,
    SizesComponent,
    SidebarComponent,
    InformationComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProductComponent {
  private supabaseService = inject(SupabaseService);

  private basicInfoRef = viewChild.required(BasicInformationComponent);
  private characteristicsRef = viewChild.required(CharacteristicsComponent);
  private photosRef = viewChild.required(PhotosComponent);
  private sizesRef = viewChild.required(SizesComponent);
  private sidebarRef = viewChild.required(SidebarComponent);
  private informationRef = viewChild.required(InformationComponent);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public async onSubmit(): Promise<void> {
    const isFormValid =
      this.basicInfoRef().form.valid &&
      this.characteristicsRef().form.valid &&
      this.sidebarRef().form.valid &&
      this.informationRef().form.valid;

    if (!isFormValid) {
      this.showModal('error', 'Форма не валидна. Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const basicInfo = this.basicInfoRef().form.getRawValue();
    const characteristics = this.characteristicsRef().form.getRawValue();
    const sidebar = this.sidebarRef().form.getRawValue();
    const description = this.informationRef().form.getRawValue();
    const sizes = this.sizesRef().sizes();
    const photosData = this.photosRef().photos();

    if (photosData.length === 0) {
      this.showModal('error', 'Добавте хотя-бы одно фото.');
      return;
    }

    this.showModal('wait', 'Создаём товар...');

    const imageUrls: string[] = await Promise.all(
      photosData.map((photo) => this.supabaseService.uploadProductImage(photo.file)),
    );

    const product: Omit<IProduct, 'id' | 'created_at' | 'categories'> = {
      name: basicInfo.title ?? '',
      brand: basicInfo.brand ?? '',
      category_id: 3,
      gender: basicInfo.gender ?? '',
      badge: basicInfo.tag === 'none' ? null : (basicInfo.tag as 'new' | 'sale' | null),
      price: Number(sidebar.price) || 0,
      old_price: sidebar.oldPrice ? Number(sidebar.oldPrice) : null,
      discount: sidebar.discount ? Number(sidebar.discount) : null,
      description: {
        intro: description.descMain ?? '',
        features: description.descFeatures ?? '',
        technologies: description.descTech ?? '',
        about: description.descAbout ?? '',
      },
      specs: {
        upper: characteristics.material ?? '',
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
      rating: 0,
      reviews_count: 0,
      in_stock: true,
    };

    try {
      await this.supabaseService.createProduct(product);
      this.showModal('success', 'Товар успешно создан!');
    } catch (error) {
      this.showModal('error', 'Не удалось создать товар. Попробуйте снова');
    }
  }
}
