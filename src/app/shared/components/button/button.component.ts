import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <button
      *ngIf="type === 'button'"
      (click)="onClick()"
      [ngClass]="[buttonClasses, defaultClasses]"
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.borderRadius]="borderRadius"
      [disabled]="disabled"
      [style.padding]="padding"
      class="transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <i class="material-icons mr-2">{{ icon }}</i>
      </ng-container>
      {{ label }}
      <ng-container *ngIf="icon && iconPosition === 'right'">
        <i class="material-icons ml-2">{{ icon }}</i>
      </ng-container>
    </button>
    <a
      *ngIf="type === 'link'"
      (click)="onClick()"
      [ngClass]="[buttonClasses, defaultClasses]"
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.borderRadius]="borderRadius"
      [style.padding]="padding"
      [routerLink]="path"
      class="transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <i class="material-icons mr-2">{{ icon }}</i>
      </ng-container>
      {{ label }}
      <ng-container *ngIf="icon && iconPosition === 'right'">
        <i class="material-icons ml-2">{{ icon }}</i>
      </ng-container>
    </a>
  `,
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() path?: string;
  @Input() type: 'button' | 'link' = 'button';
  @Input() backgroundColor: string = '#3B82F6'; // Default Tailwind blue-500
  @Input() textColor: string = '#ffffff';
  @Input() borderRadius: string = '0.5rem'; // rounded-md
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() disabled: boolean = false;
  @Input() padding: string = '0.5rem 1rem'; // default px-4 py-2
  @Input() shadow: boolean = true;
  @Input() outline: boolean = false;
  @Input() defaultClasses?: string;

  @Output() buttonClick = new EventEmitter<any>(); // ✅ Add this

  get buttonClasses() {
    return [
      'flex',
      'items-center',
      'justify-center',
      this.shadow ? 'shadow-md' : '',
      this.outline ? 'border-2 border-current bg-transparent' : '',
    ].join(' ');
  }

  onClick() {
    if (!this.disabled) {
      this.buttonClick.emit({}); // ✅ Emit custom click event
    }
  }
}
