import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalyticsState } from './analytics.reducer';

export const selectAnalyticsState =
  createFeatureSelector<AnalyticsState>('analyticsState');

export const selectAnalyticsData = createSelector(
  selectAnalyticsState,
  (state) => state?.data || null
);

export const selectAnalyticsDataEventHasData = createSelector(
  selectAnalyticsState,
  (state) => state.data !== null
);

export const selectDashboardAnalyticsDataEventHasData = createSelector(
  selectAnalyticsState,
  (state) => state.dashboardAnalytics !== null
);

export const selectAnalyticsLoading = createSelector(
  selectAnalyticsState,
  (state) => state.loading
);

export const selectAnalyticsError = createSelector(
  selectAnalyticsState,
  (state) => state.error
);

export const selectGeoRows = createSelector(
  selectAnalyticsData,
  (dashboardAnalytics) => dashboardAnalytics?.geo?.rows || []
);
