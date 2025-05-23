// src/app/shared/header/header.component.ts

import { Component, HostListener, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import {
  slideInOut,
  slideInOutRight,
  slideInOutLeft,
} from '../../animations/slide.animations';
import { ClickOutsideModule } from 'ng-click-outside';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  animations: [slideInOut, slideInOutRight, slideInOutLeft],
  imports: [CommonModule, NavigationComponent, RouterLink, ClickOutsideModule],
  template: `
    <header
      [style.backgroundColor]="headerBackgroundColor"
      class=""
      [ngClass]="
        [
          layout === 'horizontal' ? 'w-full' : 'w-full flex flex-col',
          stickyHeader ? 'fixed top-0 left-0 w-full z-50 ' : '',
          headerBorderBottom ? 'border-b border-gray-300' : '',
          headerBoxShadow === 'light'
            ? 'shadow-sm'
            : headerBoxShadow === 'medium'
            ? 'shadow-md'
            : headerBoxShadow === 'strong'
            ? 'shadow-lg'
            : ''
        ].join(' ')
      "
    >
      <div
        *ngIf="topInfoBar"
        [ngClass]="isScrolled && stickyHeader ? 'h-0' : 'h-11'"
        [style.backgroundColor]="topInfoBarColor"
        class="w-full transition-[height] duration-300 ease-in-out justify-center flex overflow-hidden"
      >
        <a class="flex h-6 w-fit relative top-2 font-bold">{{ topInfoBar }}</a>
      </div>

      <div
        class="max-w-[1800px] relative mx-auto w-full py-4"
        [ngClass]="[
          layout === 'horizontal'
            ? 'flex items-center md:justify-between justify-start px-20'
            : 'flex flex-col items-center gap-4 px-4',
          logoPosition === 'center' ? 'grid !justify-center' : 'block'
        ]"
      >
        <!-- 🍔 Mobile Menu Icon -->
        <div class="md:hidden absolute left-4 top-1/2 -translate-y-1/2">
          <button (click)="toggleMobileMenu()" class="flex items-center">
            <i class="material-icons text-2xl">menu</i>
          </button>
        </div>

        <!-- 🔰 Logo -->
        <a
          [style.height.px]="logoHeight"
          class="flex items-center gap-2 cursor-pointer w-full md:w-auto md:justify-start"
          [ngClass]="
            [
              logoPosition === 'right'
                ? 'order-last !justify-end'
                : logoPosition === 'left'
                ? 'order-first justify-start'
                : '!justify-center w-full'
            ].join(' ')
          "
          [routerLink]="'/'"
        >
          <img
            [style.height.px]="logoHeight"
            *ngIf="logoUrl"
            [ngClass]="logoStyles"
            [src]="logoUrl"
            alt="Logo"
            class="w-auto h-10"
          />
          <span
            class="text-lg font-light"
            [style.color]="titleColor"
            [style.fontSize]="titleFontSize"
            >{{ siteTitle }}</span
          >
        </a>

        <!-- 🧭 Desktop Navigation -->
        <div class="hidden md:block">
          <app-navigation></app-navigation>
        </div>

        <!-- 📢 CTA Button -->
        <div *ngIf="showCTAButton" class="ml-4 hidden md:block">
          <button
            [ngStyle]="ctaButtonStyles"
            class="px-4 py-2 rounded font-semibold"
          >
            {{ ctaButtonLabel }}
          </button>
        </div>
      </div>

      <!-- 📱 Mobile Navigation Drawer -->
      <div
        (clickOutside)="toggleMobileMenu()"
        *ngIf="mobileMenuOpen"
        [@slideInOut]="drawerSide === 'left' ? 'in' : null"
        [@slideInOutLeft]="drawerSide === 'right' ? 'in' : null"
        class="fixed top-0 h-full w-64 shadow-lg z-50 p-4 bg-[#005480]"
        [ngClass]="drawerSide === 'right' ? 'right-0' : 'left-0'"
      >
        <div class="flex justify-end">
          <button (click)="toggleMobileMenu()">
            <i class="material-icons text-white">close</i>
          </button>
        </div>
        <app-navigation
          (onNavigationClicked)="toggleMobileMenu()"
          [layout]="'vertical'"
        ></app-navigation>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() topInfoBar: string = '';
  @Input() topInfoBarColor: string = '';

  @Input() siteTitle: string = '';
  @Input() titleColor: string = '#111827';
  @Input() titleFontSize: string = '2rem';

  @Input() headerBackgroundColor: string = '#ffffff';
  @Input() headerStyles: string = '1rem';
  @Input() stickyHeader: boolean = false;
  @Input() headerBorderBottom: boolean = false;
  @Input() headerBoxShadow: 'none' | 'light' | 'medium' | 'strong' = 'medium';

  @Input() logoUrl?: string;

  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

  @Input() logoPosition: 'left' | 'right' | 'center' = 'left';
  @Input() logoHeight: number = 0;
  @Input() logoStyles?: string;

  @Input() showCTAButton: boolean = false;
  @Input() ctaButtonLabel: string = 'Get Started';
  @Input() ctaButtonStyles: { [key: string]: string } = {
    backgroundColor: '#3B82F6',
    color: '#ffffff',
  };

  @Input() drawerSide: 'left' | 'right' = 'left';
  @Input() drawerBtnPosition: 'left' | 'right' = 'left';

  showLangDropdown: boolean = false;
  mobileMenuOpen: boolean = false;
  isScrolled = false;

  constructor(private translate: TranslateService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleLangDropdown(): void {
    this.showLangDropdown = !this.showLangDropdown;
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('preferredLang', lang);
    this.showLangDropdown = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 25;
  }
}
