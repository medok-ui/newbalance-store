import { ClipboardModule } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  imports: [ClipboardModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {}
