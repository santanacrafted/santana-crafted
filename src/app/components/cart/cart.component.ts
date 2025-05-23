import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

interface CartItem {
  name: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  couponCode: string = '';
  couponMessage: string = '';
  discount: number = 0;

  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  getTotal(): string {
    return this.cartService.getTotal().toFixed(2);
  }

  applyCoupon(): void {
    const code = this.couponCode.trim().toLowerCase();

    if (code === 'save10') {
      this.discount = 10;
      this.couponMessage = 'Coupon applied: $10 off';
    } else if (code === 'save20') {
      this.discount = 20;
      this.couponMessage = 'Coupon applied: $20 off';
    } else {
      this.discount = 0;
      this.couponMessage = 'Invalid coupon code';
    }
  }
}
