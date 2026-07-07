import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  public activeRoute = inject(ActivatedRoute);
}
