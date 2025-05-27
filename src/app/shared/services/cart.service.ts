import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  name: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  storeImg: string = '/assets/images/minimal-store.png';
  churchImg: string = '/assets/images/church-live-stream.png';
  templates = [
    {
      id: 'temp01',
      name: 'Clean Admin Dashboard',
      category: 'Dashboard',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard', 'Premium'],
    },
    {
      id: 'temp02',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      cover: this.churchImg,
      tiers: ['Basic', 'Premium'],
    },
    {
      id: 'temp03',
      name: 'Nonprofit Starter',
      category: 'Organization',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard', 'Premium'],
    },
    {
      id: 'temp04',
      name: 'Modern Storefront',
      category: 'Store',
      cover: this.churchImg,
      tiers: ['Standard', 'Premium'],
    },
    {
      id: 'temp05',
      name: 'Church Essentials',
      category: 'Church',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard'],
    },
    {
      id: 'temp06',
      name: 'Minimal Art Showcase',
      category: 'Art',
      cover: this.churchImg,
      tiers: ['Premium'],
    },
    {
      id: 'temp07',
      name: 'Dark Portfolio',
      category: 'Portfolio',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard', 'Premium'],
    },
    {
      id: 'temp08',
      name: 'Startup SaaS UI',
      category: 'Dashboard',
      cover: this.churchImg,
      tiers: ['Standard', 'Premium'],
    },
    {
      id: 'temp09',
      name: 'Event Organizer',
      category: 'Organization',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard'],
    },
    {
      id: 'temp10',
      name: 'Ecommerce Cart Pro',
      category: 'Store',
      cover: this.churchImg,
      tiers: ['Premium'],
    },
    {
      id: 'temp11',
      name: 'Faith Community Site',
      category: 'Church',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard'],
    },
    {
      id: 'temp12',
      name: 'Photography Portfolio',
      category: 'Portfolio',
      cover: this.churchImg,
      tiers: ['Premium'],
    },
    {
      id: 'temp13',
      name: 'Minimal Store',
      category: 'Store',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard'],
    },
    {
      id: 'temp14',
      name: 'Admin UI Kit',
      category: 'Dashboard',
      cover: this.churchImg,
      tiers: ['Standard', 'Premium'],
    },
    {
      id: 'temp15',
      name: 'Fundraiser Website',
      category: 'Organization',
      cover: this.storeImg,
      tiers: ['Basic', 'Standard'],
    },
    {
      id: 'temp16',
      name: 'Digital Artist Site',
      category: 'Art',
      cover: this.churchImg,
      tiers: ['Premium'],
    },
    {
      id: 'temp17',
      name: 'Volunteer Hub',
      category: 'Organization',
      cover: this.storeImg,
      tiers: ['Basic'],
    },
    {
      id: 'temp18',
      name: 'Tech Portfolio',
      category: 'Portfolio',
      cover: this.churchImg,
      tiers: ['Basic', 'Standard', 'Premium'],
    },
    {
      id: 'temp19',
      name: 'Church Livestream',
      category: 'Church',
      cover: this.storeImg,
      tiers: ['Premium'],
    },
    {
      id: 'temp20',
      name: 'Single Page Store',
      category: 'Store',
      cover: this.churchImg,
      tiers: ['Basic'],
    },
  ];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get items(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addItem(item: CartItem): void {
    const updated = [...this.items, item];
    this.cartItemsSubject.next(updated);
  }

  removeItem(index: number): void {
    const updated = this.items.filter((_, i) => i !== index);
    this.cartItemsSubject.next(updated);
  }

  clear(): void {
    this.cartItemsSubject.next([]);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }
}
