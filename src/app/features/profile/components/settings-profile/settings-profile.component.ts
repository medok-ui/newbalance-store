import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeliveryAddressSettingComponent } from './components/delivery-address-setting/delivery-address-setting.component';
import { UpdatePasswordSettingComponent } from './components/update-password-setting/update-password-setting.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';

@Component({
  selector: 'app-settings-profile',
  imports: [UserSettingComponent, DeliveryAddressSettingComponent, UpdatePasswordSettingComponent],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProfileComponent {}
