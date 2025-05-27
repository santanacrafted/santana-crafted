import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import {
  NavigationConfig,
  NavItem,
} from '../../../config/navigation/navigation.config';
import { NavigationSettings } from '../../../config/navigation/navigation-settings.config';
import { dropdownAnimation } from '../../animations/dropdown.animation';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  animations: [dropdownAnimation],
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  navItems: NavItem[] = NavigationConfig;
  settings = NavigationSettings;
  @Input() layout?: string;
  @Output() onNavigationClicked = new EventEmitter<any>();
  cartCount = 0;
  show = true;

  // Layout class based on settings
  get layoutClasses() {
    if (this.layout) {
      return this.layout === 'horizontal'
        ? 'flex flex-wrap items-center gap-4 md:gap-8'
        : 'flex flex-col';
    } else {
      return this.settings.layout === 'horizontal'
        ? 'flex flex-wrap items-center gap-4 md:gap-8'
        : 'flex flex-col';
    }
  }

  constructor(private cartService: CartService, public router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
    });
  }

  // Conditional children dropdown behavior
  getChildrenClasses() {
    if (this.layout) {
      if (this.layout === 'horizontal') {
        return 'hidden group-hover:flex flex-col bg-white shadow-md absolute top-full left-0 min-w-[180px] z-50';
      } else {
        return 'flex flex-col pl-6'; // Always visible under parent in vertical layout
      }
    } else {
      if (this.settings.layout === 'horizontal') {
        return 'hidden group-hover:flex flex-col bg-white shadow-md absolute top-full left-0 min-w-[180px] z-50';
      } else {
        return 'flex flex-col pl-6'; // Always visible under parent in vertical layout
      }
    }
  }
}
