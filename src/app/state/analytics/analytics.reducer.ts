import { createReducer, on } from '@ngrx/store';
import * as AnalyticsActions from './analytics.actions';

export interface AnalyticsState {
  data: any;
  loading: boolean;
  error: any;
  dashboardAnalytics: any;
}

export const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
  dashboardAnalytics: null,
};

export const analyticsReducer = createReducer(
  initialState,
  on(AnalyticsActions.loadAnalytics, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AnalyticsActions.loadAnalyticsSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(AnalyticsActions.loadAnalyticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AnalyticsActions.loadAnalyticsDashboard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AnalyticsActions.loadAnalyticsDashboardSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    dashboardAnalytics: data,
  })),
  on(AnalyticsActions.loadAnalyticsDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
