import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  today = new Date();
  isSidebarCollapsed = false;
  screenWidth = window.innerWidth;

  ngOnInit(): void {
    this.updateSidebarState();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth;
    this.updateSidebarState();
  }

  private updateSidebarState(): void {
    // Optional: auto-close sidebar on small screens
    if (this.screenWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }
}
