import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  SwiperComponent,
  SlideItems,
} from '../../shared/components/swiper/swiper.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, AfterViewInit {
  lang: 'en' | 'es' = 'en';
  logoUrl = '/assets/icons/SantanaCrafted-logo.png';
  backgroundImg: string = '/assets/images/devices-mockups.png';
  cards: SlideItems[] = [
    {
      title: { en: 'Modern Design', es: 'Diseño Moderno' },
      description: {
        en: 'All templates follow the latest UI/UX principles using Tailwind CSS and Angular best practices.',
        es: 'Todas las plantillas siguen los principios más recientes de UI/UX utilizando Tailwind CSS y las mejores prácticas de Angular.',
      },
    },
    {
      title: { en: 'Built for Speed', es: 'Construido para la Velocidad' },
      description: {
        en: 'Ready-to-deploy Angular structures with Firebase, SSR, and responsive components out of the box.',
        es: 'Estructuras de Angular listas para implementar con Firebase, SSR y componentes responsivos desde el inicio.',
      },
    },
    {
      title: { en: 'Easy Customization', es: 'Fácil Personalización' },
      description: {
        en: 'Quickly tailor layouts, colors, and content for clients or ministry use with clean code separation.',
        es: 'Personaliza rápidamente diseños, colores y contenido para clientes o ministerios con un código limpio y separado.',
      },
    },
    {
      title: { en: 'Responsive Layouts', es: 'Diseños Responsivos' },
      description: {
        en: 'Designed to look perfect on desktops, tablets, and mobile devices without extra effort.',
        es: 'Diseñado para lucir perfecto en computadoras, tabletas y dispositivos móviles sin esfuerzo adicional.',
      },
    },
    {
      title: { en: 'Dynamic Components', es: 'Componentes Dinámicos' },
      description: {
        en: 'Includes carousels, dropdowns, modals, and tabs — ready to plug and play.',
        es: 'Incluye carruseles, menús desplegables, modales y pestañas — listos para usar.',
      },
    },
    {
      title: { en: 'Optimized Performance', es: 'Rendimiento Optimizado' },
      description: {
        en: 'Built with lazy loading, SSR support, and Angular best practices for fast loading sites.',
        es: 'Construido con carga diferida, soporte para SSR y las mejores prácticas de Angular para sitios de carga rápida.',
      },
    },
  ];

  testimonials = [
    {
      name: 'Alex Rivera',
      title: 'Frontend Developer',
      quote:
        'The templates are clean, responsive, and saved me countless hours.',
      avatar: '/assets/testimonial-avatar1.jpg',
    },
    {
      name: 'Maria Lopez',
      title: 'Church Admin',
      quote:
        'I launched a church website in a weekend thanks to SantanaCrafted.',
      avatar: '/assets/testimonial-avatar2.jpg',
    },
    {
      name: 'Derrick Chan',
      title: 'UI/UX Designer',
      quote: 'Well-documented, accessible, and mobile-first. Highly recommend.',
      avatar: '/assets/testimonial-avatar3.jpg',
    },
    {
      name: 'Jasmine Patel',
      title: 'Software Engineer',
      quote: 'The design system was intuitive and saved us a lot of dev time.',
      avatar: '/assets/testimonial-avatar4.jpg',
    },
    {
      name: 'Carlos Mendoza',
      title: 'IT Director',
      quote: 'Perfect for our church outreach site. Looks amazing on mobile.',
      avatar: '/assets/testimonial-avatar5.jpg',
    },
    {
      name: 'Angela Wright',
      title: 'Full Stack Dev',
      quote:
        'A solid starter for any Angular project. I use it for client demos.',
      avatar: '/assets/testimonial-avatar6.jpg',
    },
    {
      name: 'Brian Kim',
      title: 'Technical Lead',
      quote: 'We were up and running in a day. Love the modular layout.',
      avatar: '/assets/testimonial-avatar7.jpg',
    },
    {
      name: 'Olivia Tran',
      title: 'Digital Strategist',
      quote:
        'Looks professional, works great, and saves us from scratch builds.',
      avatar: '/assets/testimonial-avatar8.jpg',
    },
    {
      name: 'Mark Thompson',
      title: 'Agency Owner',
      quote: 'Perfect for prototyping and pitching ideas to clients.',
      avatar: '/assets/testimonial-avatar9.jpg',
    },
    {
      name: 'Sofia Delgado',
      title: 'Nonprofit Web Coordinator',
      quote: 'Finally, a template that balances beauty and usability.',
      avatar: '/assets/testimonial-avatar10.jpg',
    },
    {
      name: 'Daniel Li',
      title: 'Freelancer',
      quote: 'Loved the simplicity and structure. Client was thrilled.',
      avatar: '/assets/testimonial-avatar11.jpg',
    },
    {
      name: 'Rebecca Allen',
      title: 'Project Manager',
      quote: 'Designers and developers alike appreciated how well it’s built.',
      avatar: '/assets/testimonial-avatar12.jpg',
    },
    {
      name: 'Alex Rivera',
      title: 'Frontend Developer',
      quote:
        'The templates are clean, responsive, and saved me countless hours.',
      avatar: '/assets/testimonial-avatar1.jpg',
    },
    {
      name: 'Maria Lopez',
      title: 'Church Admin',
      quote:
        'I launched a church website in a weekend thanks to SantanaCrafted.',
      avatar: '/assets/testimonial-avatar2.jpg',
    },
    {
      name: 'Derrick Chan',
      title: 'UI/UX Designer',
      quote: 'Well-documented, accessible, and mobile-first. Highly recommend.',
      avatar: '/assets/testimonial-avatar3.jpg',
    },
    {
      name: 'Jasmine Patel',
      title: 'Software Engineer',
      quote: 'The design system was intuitive and saved us a lot of dev time.',
      avatar: '/assets/testimonial-avatar4.jpg',
    },
  ];

  visibleTestimonials: {
    name: string;
    title: string;
    quote: string;
    avatar: string;
  }[] = [];
  loadCount = 8; // Number to show at a time
  @ViewChild('myVideo') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('adBanner') adBannerRef!: ElementRef;
  @ViewChild('videoSection') videoSection!: ElementRef<HTMLElement>;

  isVideoInView = false;
  videoEnded = false;
  videoIsPaused: boolean = false;
  videoHasBeenPlayed: boolean = false;
  videoAlreadyWatched: boolean = false;
  playVideoBtn: 'playing' | 'stopped' = 'stopped';
  videoUrl =
    'https://video-previews.elements.envatousercontent.com/h264-video-previews/925e4d92-7248-4ef4-8c46-d36e7687b79c/57614821.mp4';

  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.visibleTestimonials = this.testimonials.slice(0, this.loadCount);
  }

  ngAfterViewInit(): void {
    // Don't auto-play if video has already been watched
    this.videoAlreadyWatched = localStorage.getItem('videoWatched') === 'true';
    const target = this.videoRef.nativeElement;
    const offsetTop = target.getBoundingClientRect().top + window.scrollY;
    const videoEl = this.videoRef.nativeElement;

    // Scroll observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (this.videoIsPaused === true || this.videoAlreadyWatched) return;
        this.isVideoInView = entry.isIntersecting && !this.videoEnded;

        if (this.isVideoInView) {
          this.playWithSound();
          this.videoHasBeenPlayed = true;
          this.videoIsPaused = false;
          window.scrollTo({
            top: offsetTop - 82,
            behavior: 'smooth',
          });
        } else {
          if (this.videoHasBeenPlayed) {
            this.closeVideo();
          }
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(videoEl);

    // Video end handler
    videoEl.addEventListener('ended', () => {
      this.videoEnded = true;
      this.isVideoInView = false;
      this.playVideoBtn = 'stopped';
      localStorage.setItem('videoWatched', 'true'); // ✅ persist watched flag
    });
  }

  playWithSound(): void {
    const videoEl = this.videoRef.nativeElement;
    const offsetTop = videoEl.getBoundingClientRect().top + window.scrollY;

    this.videoIsPaused = false;
    this.videoEnded = false;
    this.isVideoInView = true;
    this.cd.detectChanges();
    // Scroll to video
    window.scrollTo({
      top: offsetTop - 82,
      behavior: 'smooth',
    });

    // Start with volume = 0 and unmute
    videoEl.volume = 0;
    videoEl.muted = false;

    // Try to play the video
    videoEl
      .play()
      .then(() => {
        this.playVideoBtn = 'playing';
        // Fade in audio over 500ms
        const fadeDuration = 2000; // ms
        const interval = 50; // ms
        const steps = fadeDuration / interval;
        const volumeStep = 1 / steps;

        let currentVolume = 0;

        const fadeIn = setInterval(() => {
          currentVolume += volumeStep;

          if (currentVolume >= 1) {
            videoEl.volume = 1;
            clearInterval(fadeIn);
          } else {
            videoEl.volume = currentVolume;
          }
        }, interval);
      })
      .catch((err) => {
        console.warn('Video play failed:', err);
      });
  }

  closeVideo(): void {
    const videoEl = this.videoRef.nativeElement;
    const fadeDuration = 500; // total time in ms
    const interval = 50; // time between steps
    const steps = fadeDuration / interval;
    const volumeStep = videoEl.volume / steps;
    this.videoIsPaused = true;
    this.videoEnded = true;
    let currentVolume = videoEl.volume;
    this.playVideoBtn = 'stopped';

    const fadeOut = setInterval(() => {
      currentVolume -= volumeStep;

      if (currentVolume <= 0) {
        videoEl.volume = 0;
        videoEl.pause();
        if (!this.isVideoInView) {
          videoEl.currentTime = 0;
        }
        videoEl.muted = true;
        clearInterval(fadeOut);

        // Restore volume for next play
        videoEl.volume = 1;
      } else {
        videoEl.volume = currentVolume;
      }
    }, interval);
  }

  loadMore(): void {
    const next = this.visibleTestimonials.length + this.loadCount;
    this.visibleTestimonials = this.testimonials.slice(0, next);
  }
}
