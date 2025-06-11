import { createAction, props } from '@ngrx/store';

export const loadAnalytics = createAction(
  '[Analytics] Load Dashboard',
  props<{ startDate: string }>() // e.g., '7daysAgo'
);

export const loadAnalyticsSuccess = createAction(
  '[Analytics] Load Dashboard Success',
  props<{ data: any }>()
);

export const loadAnalyticsFailure = createAction(
  '[Analytics] Load Dashboard Failure',
  props<{ error: any }>()
);

export const loadAnalyticsDashboard = createAction(
  '[Analytics] Load Dashboard',
  props<{ startDate: string }>()
);

export const loadAnalyticsDashboardSuccess = createAction(
  '[Analytics] Load Dashboard Success',
  props<{ data: any }>()
);

export const loadAnalyticsDashboardFailure = createAction(
  '[Analytics] Load Dashboard Failure',
  props<{ error: any }>()
);
