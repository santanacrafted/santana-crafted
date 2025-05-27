import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-detail.component.html',
})
export class TemplateDetailComponent implements OnInit {
  templateId = '';
  template: any;
  selectedTier = 'basic;';
  constructor(private route: ActivatedRoute, private cart: CartService) {}

  ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id')!;
    this.template = this.cart.templates.filter(
      (x) => x.id === this.templateId
    )[0];
    this.selectedTier = this.template?.tiers?.[0] || 'Basic';
    console.log(this.template);
  }
}
