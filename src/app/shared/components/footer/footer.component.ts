import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  path?: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  template: `
    <footer
      [ngClass]="layout"
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.fontFamily]="fontFamily"
    >
      <div
        class="w-full max-w-7xl mx-auto py-8 px-4 grid gap-8"
        [ngClass]="gridClasses"
      >
        <div *ngFor="let section of sections">
          <h3 class="font-bold mb-4" [style.fontSize]="headingFontSize">
            {{ section.title | translate }}
          </h3>
          <ul class="space-y-2">
            <li *ngFor="let link of section.links">
              <a
                *ngIf="!link.external"
                [routerLink]="link.path"
                [target]="link.external ? '_blank' : '_self'"
                class="hover:!text-[#e1b609] transition duration-200 cursor-pointer font-light"
                [style.color]="linkColor"
                [style.fontSize]="linkFontSize"
              >
                {{ link.label | translate }}
              </a>
              <a
                *ngIf="link.external"
                [href]="link.path"
                [target]="link.external ? '_blank' : '_self'"
                class="hover:!text-[#e1b609] transition duration-200 cursor-pointer font-light"
                [style.color]="linkColor"
                [style.fontSize]="linkFontSize"
              >
                {{ link.label | translate }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="text-center mt-8 text-sm pb-4 font-light"
        [style.color]="copyrightColor"
      >
        {{ copyrightText | translate }}
      </div>
    </footer>
  `,
})
export class FooterComponent {
  @Input() sections: FooterSection[] = [];
  @Input() backgroundColor: string = '#1F2937'; // default dark gray
  @Input() textColor: string = '#ffffff';
  @Input() fontFamily: string = 'Poppins, sans-serif';
  @Input() headingFontSize: string = '1.25rem'; // 20px
  @Input() linkFontSize: string = '1rem'; // 16px
  @Input() linkColor: string = '#d1d5db'; // gray-300
  @Input() copyrightText: string = 'RIGHTS_RESERVED';
  @Input() layout:
    | 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    | 'grid-cols-2 md:grid-cols-4' =
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  @Input() copyrightColor: string = '#9ca3af';

  get gridClasses() {
    return `${this.layout}`;
  }
}
