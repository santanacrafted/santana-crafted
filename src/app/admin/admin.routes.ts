import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TemplatesManagementComponent } from './components/templates-management/templates-management.component';
import { DonationsComponent } from './components/donations/donations.component';
import { AuthGuard } from '../shared/gaurds/auth.guard';
import { RedirectIfAuthenticatedGuard } from '../shared/gaurds/authenticated.guard';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminOnlyGuard } from '../shared/gaurds/admin-only.guard';
import { AnalyticsComponent } from './components/analytics/analytics.component';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'templates-management',
    component: TemplatesManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'donations',
    component: DonationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./components/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  },
];
