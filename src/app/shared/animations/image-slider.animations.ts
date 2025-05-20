import { animate, style, transition, trigger } from '@angular/animations';

export const slideLeftFade = trigger('slideLeftFade', [
  transition('* => *', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const slideRightFade = trigger('slideRightFade', [
  transition('* => *', [
    style({ opacity: 0, transform: 'translateX(-100%)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const zoomIn = trigger('zoomIn', [
  transition('* => *', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition('* => *', [
    style({ opacity: 0 }),
    animate('600ms ease-out', style({ opacity: 1 }))
  ])
]);

export const rotateIn = trigger('rotateIn', [
  transition('* => *', [
    style({ opacity: 0, transform: 'rotate(-10deg) scale(0.9)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'rotate(0deg) scale(1)' }))
  ])
]);