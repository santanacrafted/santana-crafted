import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService, CartItem } from '../../shared/services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  paymentMethods = ['Credit Card', 'Debit Card'];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      notes: [''],
      paymentMethod: ['', Validators.required],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/d{2}$')],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.items;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  onCheckout(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      const orderDetails = {
        ...this.checkoutForm.value,
        items: this.cartItems,
        total: this.getTotal(),
      };

      console.log('Order submitted:', orderDetails);

      // Placeholder: navigate to thank-you page or send to backend
      this.cartService.clear();
      this.router.navigate(['/thank-you']);
    }
  }
}
