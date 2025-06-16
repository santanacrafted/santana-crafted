import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import {
  FooterComponent,
  FooterSection,
} from './shared/components/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SantanaCrafted';
  logoUrl = '/assets/icons/SantanaCrafted-logo.png';
  showFooterAndHeader = true;
  footerSections: FooterSection[] = [
    {
      title: 'FOOTER_QUICK_LINK_HEADER',
      links: [{ label: 'FOOTER_QUICK_LINK_3', path: '/contact' }],
    },
    {
      title: 'FOOTER_SOCIAL_MEDIA_HEADER',
      links: [
        {
          label: 'FOOTER_SOCIAL_MEDIA_LINK_2',
          path: 'https://www.youtube.com/@SantanaCrafted',
          external: true,
        },
      ],
    },
    {
      title: 'FOOTER_LEGAL_HEADER',
      links: [
        { label: 'FOOTER_LEGAL_LINK_1', path: '/privacy-policy' },
        { label: 'FOOTER_LEGAL_LINK_2', path: '/terms' },
      ],
    },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      savedLang ?? (browserLang?.match(/en|es/) ? browserLang : 'en');

    this.translate.use(defaultLang);
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.showFooterAndHeader = !event.urlAfterRedirects.includes('/admin');
      });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
