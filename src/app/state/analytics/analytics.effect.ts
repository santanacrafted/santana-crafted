import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsService } from '../../shared/services/analytics.service';
import * as AnalyticsActions from './analytics.actions';
import {
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  withLatestFrom,
} from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  selectAnalyticsDataEventHasData,
  selectDashboardAnalyticsDataEventHasData,
} from './analytics.selector';

@Injectable()
export class AnalyticsEffects {
  loadAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadAnalytics),
      withLatestFrom(this.store.pipe(select(selectAnalyticsDataEventHasData))),
      filter(([_, hasData]) => !hasData),
      mergeMap(([action]) =>
        from(this.analyticsService.getDashboardData(action.startDate)).pipe(
          map((result) =>
            AnalyticsActions.loadAnalyticsSuccess({ data: result.data })
          ),
          catchError((error) =>
            of(AnalyticsActions.loadAnalyticsFailure({ error }))
          )
        )
      )
    )
  );

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadAnalyticsDashboard),
      withLatestFrom(
        this.store.pipe(select(selectDashboardAnalyticsDataEventHasData))
      ),
      filter(([_, hasData]) => !hasData),
      mergeMap(([action]) =>
        from(this.analyticsService.getDashboardData(action.startDate)).pipe(
          map((result) =>
            AnalyticsActions.loadAnalyticsSuccess({ data: result.data })
          ),
          catchError((error) =>
            of(AnalyticsActions.loadAnalyticsFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private analyticsService: AnalyticsService
  ) {}
}
