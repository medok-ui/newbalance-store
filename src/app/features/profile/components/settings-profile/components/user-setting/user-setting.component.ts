import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { IUserProfile } from '../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-setting',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  public currentUser = signal<IUserProfile | null>(null);

  public isModalOpen = signal<boolean>(false);
  public typeModal = signal<'success' | 'error' | 'wait'>('wait');
  public messageModal = signal<string>('');

  public showModal(type: 'success' | 'error' | 'wait', message: string): void {
    this.typeModal.set(type);
    this.messageModal.set(message);
    this.isModalOpen.set(true);
  }

  public ngOnInit(): void {
    const data = this.supabaseService.infoCurrentUser();
    if (!data ) {
      this.showModal('error', 'Что то пошло не так.');
      return;
    }

    this.currentUser.set(data);

    this.form.patchValue({
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      phone: data.phone ?? '',
    });
  }

  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),

    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/),
    ]),
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.showModal(
        'error',
        'Проверьте поля: имя, фамилия и телефон обязательны. Телефон в формате +7 999 123 45 67 или 8 999 123 45 67.',
      );
      return;
    }
    const firstName = this.form.value.firstName;
    const lastName = this.form.value.lastName;
    const phone = this.form.value.phone;

    if (!firstName || !lastName || !phone) return;
    this.supabaseService.updateUserProfile(firstName, lastName, phone);

    this.showModal('success', 'Данные успешно изменены');
  }

}
