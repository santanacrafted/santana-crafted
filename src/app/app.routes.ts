import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { FeaturesComponent } from './components/features/features.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'templates', component: TemplatesComponent },
  {
    path: 'template/:id',
    loadComponent: () =>
      import('./components/template-detail/template-detail.component').then(
        (m) => m.TemplateDetailComponent
      ),
  },
  { path: 'features', component: FeaturesComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
];
