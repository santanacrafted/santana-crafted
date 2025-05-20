import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from './swiper.directive';

export interface SlideItems {
  title: { es: string; en: string };
  description: { es: string; en: string };
  coverImage?: string;
  captionPosition?: string;
  textAlignment?: 'text-center' | 'text-left' | 'text-right';
  badge?: string;
  icon?: string;
  route?: string;
  descriptionFontClasses?: string;
  titleFontClasses?: string;
  slideOpacity?: string;
  textAnimation?: string;
}

@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule, InfoCardComponent, TranslateModule, SwiperDirective],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  animations: [
    trigger('fadeCaption', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
      transition('active => void', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideUpCaption', [
      transition('void => active', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('zoomInCaption', [
      transition('void => active', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  @Input() items: SlideItems[] | null = [];
  @Input() slidesToShow: number = 1;
  @Input() swiperheight: string = 'h-150';
  @Input() autoplay: boolean = true;
  @Input() autoplaySpeed: number = 5000;
  @Input() showImageCaption: boolean = true;
  @Input() defaultCaptionPosition: string = 'bottom-left';
  @Input() captionTextAlignment: 'text-center' | 'text-left' | 'text-right' =
    'text-left';
  @Input() type: 'image' | 'cards' = 'image';
  @Input() infinite: boolean = true;
  breakpointsConfig: any;
  isAtEnd: boolean = false;
  isAtBeginning: boolean = true;
  activeIndex: number = 0;
  captionVisible = true;
  captionAnimation: any;
  captionState: any;
  lang: 'en' | 'es' = 'en';
  swiperConfig: SwiperOptions = {
    loop: true,
    speed: 8000, // higher = slower
    slidesPerView: 2,
    spaceBetween: 24,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: false, // Optional: disable manual swiping
    freeMode: {
      enabled: true,
      momentum: false,
    },
  };
  constructor(
    private cd: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.lang = (this.translateService.currentLang ||
      this.translateService.getDefaultLang()) as 'en' | 'es';

    this.translateService.onLangChange.subscribe(
      (event: { lang: 'en' | 'es' }) => {
        this.lang = event.lang;
      }
    );
    // if (this.type === 'cards') {
    //   this.breakpointsConfig = {
    //     0: {
    //       slidesPerView: 1,
    //       spaceBetween: 10,
    //     },
    //     640: {
    //       slidesPerView: 1,
    //       spaceBetween: 16,
    //     },
    //     768: {
    //       slidesPerView: 2,
    //       spaceBetween: 20,
    //     },
    //     1024: {
    //       slidesPerView: 3,
    //       spaceBetween: 24,
    //     },
    //     1280: {
    //       slidesPerView: 4,
    //       spaceBetween: 28,
    //     },
    //     1440: {
    //       slidesPerView: 4,
    //       spaceBetween: 32,
    //     },
    //     1600: {
    //       slidesPerView: 5,
    //       spaceBetween: 36,
    //     },
    //     1920: {
    //       slidesPerView: 6,
    //       spaceBetween: 40,
    //     },
    //   };

    //   this.swiperConfig.spaceBetween = 20;
    //   this.swiperConfig.breakpoints = this.breakpointsConfig;
    //   this.swiperConfig.navigation = false;
    //   this.swiperConfig.loop = this.infinite;
    // }

    // if (this.autoplay) {
    //   this.swiperConfig.autoplay = {
    //     delay: this.autoplaySpeed,
    //     disableOnInteraction: false,
    //   };
    // }
    // this.swiperConfig.slidesPerView = this.slidesToShow;
  }

  get autoplayConfig(): string | null {
    return this.autoplay ? JSON.stringify({ delay: this.autoplaySpeed }) : null;
  }

  getCaptionClasses(position: string): string[] {
    const base = ['absolute', 'flex', 'w-full', 'h-full', 'px-4'];
    const map: Record<string, string[]> = {
      'top-left': ['caption-top-left'],
      'top-center': ['caption-top-center'],
      'top-right': ['caption-top-right'],
      'center-left': ['caption-center-left'],
      center: ['caption-center'],
      'center-right': ['caption-center-right'],
      'bottom-left': ['caption-bottom-left'],
      'bottom-center': ['caption-bottom-center'],
      'bottom-right': ['caption-bottom-right'],
    };
    return base.concat(map[position] || ['caption-center']);
  }

  goNext() {
    const swiper = this.swiper?.nativeElement.swiper;
    swiper?.slideNext();
  }

  goPrev() {
    const swiper = this.swiper?.nativeElement.swiper;
    swiper?.slidePrev();
  }

  slideChange(swiper: any) {
    const swiperInstance = swiper.detail[0];

    // Prevent duplicate triggering due to looping
    const realIndex = swiperInstance.realIndex ?? swiperInstance.activeIndex;

    if (this.activeIndex === realIndex) return;

    this.activeIndex = realIndex;
    this.captionState = 'void';
    this.captionVisible = false;
    this.isAtEnd = swiperInstance.isEnd;
    this.isAtBeginning = swiperInstance.isBeginning;

    setTimeout(() => {
      this.captionState = 'active';
      this.captionVisible = true;
      this.cd.detectChanges();
    }, 500);
  }
}
