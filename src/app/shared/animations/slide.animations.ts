import { animate, style, transition, trigger } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
    ])
]);

export const slideInOutRight = trigger('slideInOutRight', [
    transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
    ])
]);

export const slideInOutLeft = trigger('slideInOutLeft', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
    ])
]);