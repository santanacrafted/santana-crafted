import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-popup',
  imports: [CommonModule],
  template: `
    <ng-container *ngTemplateOutlet="data.template; context: data.context"></ng-container>
  `
})
export class DynamicPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
