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
