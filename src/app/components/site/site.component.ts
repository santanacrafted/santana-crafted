import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import {
  FooterComponent,
  FooterSection,
} from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-site',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss',
})
export class SiteComponent {
  title = 'SantanaCrafted';
  logoUrl = '/assets/icons/SantanaCrafted-logo.png';
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
    {
      title: 'Admin',
      links: [{ label: 'Login', path: '/admin' }],
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
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
