import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase.service';
import { IUserProfile } from '../../../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  public currentUser = signal<IUserProfile | null>(null);

  public async ngOnInit(): Promise<void> {
    const data = await this.supabaseService.getUser();
    if (!data) return;
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
    if (this.form.valid) {
      const firstName = this.form.value.firstName;
      const lastName = this.form.value.lastName;
      const phone = this.form.value.phone;

      if (!firstName || !lastName || !phone) return;

      this.supabaseService.updateUserProfile(firstName, lastName, phone);
    }
  }
}
