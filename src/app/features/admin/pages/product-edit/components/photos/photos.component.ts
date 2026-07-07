import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { IProduct } from '../../../../../products/interfaces/product.interface';
import { UploadedPhoto } from '../../../new-product/components/photos/photos.component';

@Component({
  selector: 'app-photos',
  imports: [ModalComponent],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosComponent {
  private supabaseService = inject(SupabaseService);
  public product = input.required<IProduct | undefined>();
  public isDragging = signal<boolean>(false);

  public photos = signal<UploadedPhoto[]>([]);
  public existingImages = signal<string[]>([]);

  private fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  constructor() {
    effect(() => {
      const images = this.product()?.images;
      if (images) {
        this.existingImages.set(images);
      }
    });
  }

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    this.processFiles(Array.from(files!));
  }

  public processFiles(files: File[]): void {
    const validFiles = files.filter((file) => this.isValidFile(file));
    const newPhotos: UploadedPhoto[] = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    this.photos.update((currentPhotos) => [...currentPhotos, ...newPhotos]);
  }

  public isValidFile(file: File): boolean {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.showModal('error', `Отклонено: ${file.name}. Недопустимый формат.`);
      return false;
    }
    if (file.size > this.MAX_FILE_SIZE) {
      this.showModal('error', `Отклонено: ${file.name}. Превышен размер 5МБ.`);
      return false;
    }
    return true;
  }

  public onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
    input.value = '';
  }

  public triggerFileInput(): void {
    this.fileInput().nativeElement.click();
  }

  public removePhoto(index: number): void {
    this.photos.update((currentPhotos) => {
      const newPhotos = [...currentPhotos];
      const deletedPhoto = newPhotos.splice(index, 1)[0];

      URL.revokeObjectURL(deletedPhoto.previewUrl); // Важно! уничтожаем объект URL, чтобы освободить память
      return newPhotos;
    });
  }

  public removeExistingImage(url: string): void {
    this.existingImages.update((prev) => prev.filter((img) => img !== url));

    this.supabaseService.deleteProductImage(url).catch((error) => {
      this.showModal('error', `Не удалось удалить файл из Storage:, ${{ error }}`);
    });
  }

  public async getFinalImageUrls(): Promise<string[]> {
    const newFiles = this.photos().map((photo) => photo.file);
    let newUrls: string[] = [];
    if (newFiles.length > 0) {
      newUrls = await Promise.all(
        newFiles.map((file) => this.supabaseService.uploadProductImage(file)),
      );
    }
    return [...this.existingImages(), ...newUrls];
  }
}
