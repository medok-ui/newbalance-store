import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IStatItem } from '../../../../shared/interfaces/stat-item.inteface';

@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent {
  public stats = input.required<IStatItem>();
}
