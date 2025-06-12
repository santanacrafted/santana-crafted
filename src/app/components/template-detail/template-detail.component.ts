import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadTemplates } from '../../state/templates/templates.actions';
import { selectTemplates } from '../../state/templates/templates.selector';
import { Observable } from 'rxjs';
import { VideoEmbedComponent } from '../../shared/components/video-embed/video-embed.component';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, VideoEmbedComponent],
  templateUrl: './template-detail.component.html',
})
export class TemplateDetailComponent implements OnInit {
  templateId = '';
  template: any;
  selectedTier: any = 'basic;';
  templates$?: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store.dispatch(loadTemplates());
    this.templateId = this.route.snapshot.paramMap.get('id')!;
    this.templates$ = this.store.select(selectTemplates);
    this.templates$.subscribe((templates) => {
      this.template = templates.find((x) => x.id === this.templateId);
      this.selectedTier = this.template?.tiers?.[0];
      console.log(this.selectedTier);
    });
  }

  addToCart() {
    const priceMap: Record<'Basic' | 'Standard' | 'Premium', number> = {
      Basic: 29,
      Standard: 69,
      Premium: 129,
    };

    const typedTier = this.selectedTier.tierName as
      | 'Basic'
      | 'Standard'
      | 'Premium';

    const cartItem: CartItem = {
      name: this.template.name,
      tier: this.selectedTier.tierName,
      price: priceMap[typedTier],
    };
    this.cart.addItem(cartItem);
    alert(
      `Added "${cartItem.name}" (${cartItem.tier}) to cart for $${cartItem.price}`
    );
    this.cd.detectChanges();
  }
}
