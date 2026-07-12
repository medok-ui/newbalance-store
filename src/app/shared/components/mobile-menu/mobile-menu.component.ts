import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INavLink, NAV_LINKS } from '../../../layout/header/header.constants';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  public navLinks = signal<INavLink[]>(NAV_LINKS);
  public isOpen = input.required<boolean>();
  public isCloseModal = output<void>();

  public closeModal(): void {
    this.isCloseModal.emit();
  }
}
