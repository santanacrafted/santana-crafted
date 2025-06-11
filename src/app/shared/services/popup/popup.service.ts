import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicPopupComponent } from '../../components/dynamic-popup/dynamic-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  open(template: TemplateRef<any>, data: any = {}): void {
    this.dialog.open(DynamicPopupComponent, {
      data: { template, context: data },
      maxWidth: '100vw',
    });
  }

  close(): void {
    this.dialog.closeAll();
  }
}
