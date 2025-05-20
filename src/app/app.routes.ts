import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { FeaturesComponent } from './components/features/features.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
];
