import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly variant = input<'default' | 'active' | 'delayed' | 'arrived'>('default');
}
