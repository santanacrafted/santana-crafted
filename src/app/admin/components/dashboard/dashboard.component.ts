import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ContriesReachedComponent } from '../widgets/contries-reached/contries-reached.component';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import {
  selectAnalyticsData,
  selectGeoRows,
} from '../../../state/analytics/analytics.selector';
import { loadAnalyticsDashboard } from '../../../state/analytics/analytics.actions';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ContriesReachedComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  geoRows$: Observable<any>;
  today = new Date();
  isSidebarCollapsed = false;
  screenWidth = window.innerWidth;

  constructor(private store: Store) {
    this.geoRows$ = this.store.select(selectGeoRows);
  }
  ngOnInit(): void {
    this.updateSidebarState();
    this.store.dispatch(loadAnalyticsDashboard({ startDate: '7daysAgo' }));
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth;
    this.updateSidebarState();
  }

  private updateSidebarState(): void {
    // Optional: auto-close sidebar on small screens
    if (this.screenWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }
}
