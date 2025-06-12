import { httpsCallable } from '@angular/fire/functions';
import { Injectable } from '@angular/core';
import { Functions } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private functions: Functions) {}

  getDashboardData(startDate: string) {
    console.log('Fetching dashboard data for start date:', startDate);
    const callable = httpsCallable(this.functions, 'getAnalyticsDashboards');
    return callable({ startDate });
  }
}
