import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-countries-reached-widget',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './contries-reached.component.html',
  styleUrl: './contries-reached.component.scss',
})
export class ContriesReachedComponent {
  @Input() geoRows: any[] = [];

  get totalCountries(): number {
    return this.geoRows.filter(
      (row) => row.dimensionValues[0].value !== '(not set)'
    ).length;
  }

  get topCountries(): any[] {
    return this.geoRows
      .filter((row) => row.dimensionValues[0].value !== '(not set)')
      .slice(0, 10);
  }
}
