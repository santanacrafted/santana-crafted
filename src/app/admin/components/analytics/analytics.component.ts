import { Component } from '@angular/core';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadAnalytics } from '../../../state/analytics/analytics.actions';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  selectAnalyticsData,
  selectAnalyticsLoading,
} from '../../../state/analytics/analytics.selector';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  analyticsData: any = null;
  loading = true;
  error: string | null = null;
  selectedTimeRange = '7daysAgo';
  analyticsData$: Observable<any>;
  geoRows$: Observable<any[]>;
  sourceRows$: Observable<any[]>;
  deviceRows$: Observable<any[]>;
  userTypeRows$: Observable<any[]>;
  engagement$: Observable<any>;
  pageRows$: Observable<any[]>;
  eventRows$: Observable<any[]>;
  loading$?: Observable<boolean>;
  geoChartData$?: Observable<{ name: string; value: number }[]>;
  sourceChartData$?: Observable<{ name: string; value: number }[]>;
  deviceChartData$?: Observable<{ name: string; value: number }[]>;
  userTypeChartData$?: Observable<{ name: string; value: number }[]>;
  userEngagementChartData$?: Observable<{ name: string; value: number }[]>;
  pageChartData$?: Observable<{ name: string; value: number }[]>;
  eventChartData$?: Observable<{ name: string; value: number }[]>;
  showGeoChart: boolean = false;
  showSourceChart: boolean = false;
  showDeviceChart = false;
  showUserTypeChart = false;
  showEngagementChart = false;
  showPageChart = false;
  showEventChart = false;

  constructor(private store: Store) {
    this.analyticsData$ = this.store.select(selectAnalyticsData);
    this.loading$ = this.store.select(selectAnalyticsLoading);
    this.geoRows$ = this.analyticsData$.pipe(
      map((data) => data?.geo?.rows || [])
    );

    this.geoChartData$ = this.analyticsData$.pipe(
      map(
        (data) =>
          data?.geo?.rows?.map((row: any) => ({
            name: row.dimensionValues[0].value,
            value: +row.metricValues[0].value,
          })) || []
      )
    );

    this.sourceRows$ = this.analyticsData$.pipe(
      map((data) => data?.source?.rows || [])
    );

    this.sourceChartData$ = this.sourceRows$.pipe(
      map((rows) =>
        rows.map((row) => ({
          name: row.dimensionValues[0].value,
          value: +row.metricValues[0].value,
        }))
      )
    );

    this.deviceRows$ = this.analyticsData$.pipe(
      map((data) => data?.device?.rows || [])
    );

    this.deviceChartData$ = this.deviceRows$.pipe(
      map((rows) =>
        rows.map((row) => ({
          name: `${row.dimensionValues[0].value} / ${row.dimensionValues[1].value}`,
          value: +row.metricValues[0].value,
        }))
      )
    );

    this.userTypeRows$ = this.analyticsData$.pipe(
      map((data) => data?.userType?.rows || [])
    );

    this.userTypeChartData$ = this.userTypeRows$.pipe(
      map((rows) =>
        rows.map((row) => ({
          name:
            row.dimensionValues[0].value === 'new'
              ? 'New Users'
              : 'Returning Users',
          value: +row.metricValues[0].value,
        }))
      )
    );

    this.engagement$ = this.analyticsData$.pipe(
      map((data) => data?.engagement || null)
    );

    this.userEngagementChartData$ = this.engagement$.pipe(
      map((data) => {
        const rows = data?.rows || [];
        return rows.length
          ? [
              {
                name: 'Avg Engagement (min)',
                value: +(+rows[0].metricValues[0].value / 60).toFixed(1),
              },
              {
                name: 'Engaged Sessions',
                value: +rows[0].metricValues[1].value,
              },
            ]
          : [];
      })
    );

    this.pageRows$ = this.analyticsData$.pipe(
      map((data) => data?.pages?.rows || [])
    );

    this.pageChartData$ = this.pageRows$.pipe(
      map((rows) =>
        rows.map((row) => ({
          name: row.dimensionValues[0].value,
          value: +row.metricValues[0].value,
        }))
      )
    );

    this.eventRows$ = this.analyticsData$.pipe(
      map((data) => data?.events?.rows || [])
    );

    this.eventChartData$ = this.eventRows$.pipe(
      map((rows) =>
        rows.map((row) => ({
          name: row.dimensionValues[0].value,
          value: +row.metricValues[0].value,
        }))
      )
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadAnalytics({ startDate: '7daysAgo' }));
  }

  onTimeRangeChange() {
    this.store.dispatch(loadAnalytics({ startDate: this.selectedTimeRange }));
  }
}
