import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    TranslateModule,
    RouterModule,
  ],
  template: `
    <div
      class="w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition duration-300 relative"
    >
      <img
        *ngIf="image"
        [src]="image"
        alt="Card Image"
        class="w-full h-48 object-cover"
      />

      <div
        *ngIf="badge"
        class="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow"
      >
        {{ badge | translate }}
      </div>

      <div class="p-6 text-center">
        <div class="flex flex-col items-center justify-center gap-2 mb-2">
          <ng-container *ngIf="icon">
            <i class="material-icons text-blue-500">{{ icon }}</i>
          </ng-container>
          <h2 *ngIf="title" class="text-xl font-bold text-gray-800">
            {{ title | translate }}
          </h2>
        </div>
        <p *ngIf="description" class="text-gray-600 text-sm mb-4">
          {{ description | translate }}
        </p>
        <app-button
          *ngIf="buttonLabel"
          [type]="'link'"
          [routerLink]="buttonRoute"
          [queryParams]="{ id: data?.id }"
          class="flex justify-center content-center"
          [defaultClasses]="'hover:!bg-blue-700 transition'"
          [padding]="'.7rem 1.5rem'"
          [backgroundColor]="'#2563EB'"
          [label]="buttonLabel"
        ></app-button>
      </div>
    </div>
  `,
})
export class InfoCardComponent {
  @Input() image?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() buttonLabel?: string;
  @Input() buttonRoute?: string;
  @Input() badge?: string;
  @Input() icon?: string;
  @Input() data?: any;
}
