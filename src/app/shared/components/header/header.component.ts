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
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.fontFamily]="fontFamily"
      class=""
      [ngClass]="
        [
          layout === 'horizontal' ? 'w-full' : 'w-full flex flex-col',
          stickyHeader ? 'fixed top-0 left-0 w-full z-50 ' : '',
          borderBottom ? 'border-b border-gray-300' : '',
          boxShadow === 'light'
            ? 'shadow-sm'
            : boxShadow === 'medium'
            ? 'shadow-md'
            : boxShadow === 'strong'
            ? 'shadow-lg'
            : ''
        ].join(' ')
      "
    >
      <div
        [ngClass]="isScrolled ? 'h-0' : 'h-11'"
        class="h-11 w-full bg-[#def071] transition-[height] duration-300 ease-in-out"
      ></div>

      <div
        class="max-w-[1800px] px-20 mx-auto w-full py-4"
        [ngClass]="[
          layout === 'horizontal'
            ? 'flex items-center md:justify-between justify-start px-4'
            : 'flex flex-col items-center gap-4 px-4',
          centerLogo ? 'grid !justify-center' : 'block'
        ]"
      >
        <!-- 🌐 Language Dropdown -->
        <!-- <div
          class="absolute top-2 right-2 sm:top-4 sm:right-4 z-50"
          (clickOutside)="showLangDropdown = false"
        >
          <div class="relative inline-block text-left">
            <button
              (click)="toggleLangDropdown()"
              class="inline-flex justify-center items-center gap-1 sm:px-4 sm:py-2 text-sm font-medium text-white rounded-md transition"
            >
              <span class="text-black">🌐 Language</span>
              <svg
                class="w-4 h-4 transition-transform"
                [ngClass]="{ 'rotate-180': showLangDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              *ngIf="showLangDropdown"
              class="absolute right-0 mt-2 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/10 focus:outline-none"
            >
              <button
                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#005480] hover:text-white transition"
                (click)="switchLang('en')"
              >
                English
              </button>
              <button
                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#005480] hover:text-white transition"
                (click)="switchLang('es')"
              >
                Español
              </button>
            </div>
          </div>
        </div> -->

        <!-- 🍔 Mobile Menu Icon -->
        <div class="md:hidden absolute left-4 top-1/2 -translate-y-1/2">
          <button (click)="toggleMobileMenu()" class="flex items-center">
            <i class="material-icons text-2xl">menu</i>
          </button>
        </div>

        <!-- 🔰 Logo -->
        <a
          [style.height.px]="logoHeight"
          class="flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center md:justify-start"
          [ngClass]="
            [
              logoPosition === 'right' ? 'order-last' : 'order-first',
              centerLogo ? '!justify-center w-full' : ''
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
          <span class="text-lg font-light" [style.fontSize]="titleFontSize">{{
            siteTitle
          }}</span>
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
  @Input() siteTitle: string = '';
  @Input() logoUrl?: string;
  @Input() backgroundColor: string = '#ffffff';
  @Input() textColor: string = '#111827';
  @Input() fontFamily: string = 'Titillium Web, Poppins, sans-serif';
  @Input() titleFontSize: string = '2rem';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
  @Input() logoPosition: 'left' | 'right' = 'left';
  @Input() logoHeight: number = 0;
  @Input() paddingTop: string = '1rem';
  @Input() paddingBottom: string = '1rem';
  @Input() logoStyles?: string;
  @Input() stickyHeader: boolean = false;
  @Input() borderBottom: boolean = false;
  @Input() boxShadow: 'none' | 'light' | 'medium' | 'strong' = 'medium';
  @Input() centerLogo: boolean = false;
  @Input() showCTAButton: boolean = false;
  @Input() ctaButtonLabel: string = 'Get Started';
  @Input() ctaButtonStyles: { [key: string]: string } = {
    backgroundColor: '#3B82F6',
    color: '#ffffff',
  };
  showLangDropdown: boolean = false;
  @Input() drawerSide: 'left' | 'right' = 'left';
  @Input() drawerBtnPosition: 'left' | 'right' = 'left';
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
    this.isScrolled = window.scrollY > 10;
  }
}
