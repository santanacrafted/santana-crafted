import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../shared/services/cart.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAddTemplateLoading,
  selectDeleteTemplateLoading,
  selectTemplateLoading,
  selectTemplates,
  selectUpdateTemplateLoading,
} from '../../state/templates/templates.selector';
import { loadTemplates } from '../../state/templates/templates.actions';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoaderComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('out => in', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out'),
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class TemplatesComponent implements OnInit, AfterViewInit {
  storeImg = '/assets/images/minimal-store.png';
  churchImg = '/assets/images/church-live-stream.png';

  templates: {
    id: string;
    name: string;
    category: string;
    cover: string;
    tiers: string[];
  }[] = [];

  @ViewChild('filterBar') filterBar!: ElementRef;
  isSticky = false;

  filteredTemplates: any[] = [];
  categories = [
    'All',
    'Dashboard',
    'Organization',
    'Store',
    'Portfolio',
    'Church',
    'Art',
  ];
  tiers = ['All', 'Basic', 'Standard', 'Premium'];

  selectedCategory = 'All';
  selectedTier = 'All';

  selectedTiers: { [templateId: string]: string } = {};
  cartItems: CartItem[] = [];
  cartCount = 0;

  templates$?: Observable<any[]>;
  selectTemplatesLoading$?: Observable<boolean>;
  selectDeleteTemplatesLoading$?: Observable<boolean>;
  selectUpdateTemplatesLoading$?: Observable<boolean>;
  selectCreateTemplatesLoading$?: Observable<boolean>;
  templatesLoaded: boolean = false;
  constructor(
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(loadTemplates());
    this.templates$ = this.store.select(selectTemplates);
    this.selectTemplatesLoading$ = this.store.select(selectTemplateLoading);
    this.selectDeleteTemplatesLoading$ = this.store.select(
      selectDeleteTemplateLoading
    );
    this.selectUpdateTemplatesLoading$ = this.store.select(
      selectUpdateTemplateLoading
    );
    this.selectCreateTemplatesLoading$ = this.store.select(
      selectAddTemplateLoading
    );
    this.templates = this.cartService.templates;
    const tierParam = this.route.snapshot.queryParamMap.get('tier');
    if (tierParam && this.tiers.includes(tierParam)) {
      this.selectedTier = tierParam;
    }

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.length;

      this.syncSelectedTiersFromCart();
      this.autoSelectSingleTier();

      if (tierParam) {
        this.autoSelectTierGlobally();
      }

      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    // this.templates$?.subscribe((templates) => {
    //   this.filteredTemplates = [...templates];
    //   this.cd.detectChanges();
    // });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.filterBar) return;
    const top = this.filterBar.nativeElement.getBoundingClientRect().top;
    this.isSticky = top <= 24;
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: '',
    });
    this.applyFilters();
  }

  filterTier(tier: string) {
    this.selectedTier = tier;
    const currentScroll = window.scrollY;

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: '',
        replaceUrl: true,
        skipLocationChange: false,
      })
      .then(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: currentScroll, behavior: 'auto' });
        });
      });

    this.applyFilters();

    if (tier === 'All') {
      this.selectedTiers = {};
    } else {
      this.autoSelectFromTierFilter();
    }
  }

  autoSelectFromTierFilter() {
    if (this.selectedTier === 'All') return;

    this.filteredTemplates.forEach((template) => {
      const cartItem = this.cartItems.find(
        (item) => item.name === template.name
      );
      if (!cartItem && template.tiers.includes(this.selectedTier)) {
        this.selectedTiers[template.id] = this.selectedTier;
      }
    });
  }

  autoSelectTierGlobally() {
    if (this.selectedTier === 'All') return;

    this.templates.forEach((template) => {
      const cartItem = this.cartItems.find(
        (item) => item.name === template.name
      );
      if (!cartItem && template.tiers.includes(this.selectedTier)) {
        this.selectedTiers[template.id] = this.selectedTier;
      }
    });
  }

  autoSelectSingleTier() {
    for (const template of this.templates) {
      if (template.tiers.length === 1) {
        this.selectedTiers[template.id] = template.tiers[0];
      }
    }
  }

  syncSelectedTiersFromCart() {
    for (const item of this.cartItems) {
      const template = this.templates.find((t) => t.name === item.name);
      if (template) {
        this.selectedTiers[template.id] = item.tier;
      }
    }
  }

  applyFilters() {
    if (!this.templates$) {
      return;
    }

    this.templates$.subscribe((templates) => {
      this.filteredTemplates = templates.filter((template) => {
        const categoryMatch =
          this.selectedCategory === 'All' ||
          template.category === this.selectedCategory;

        const tierMatch =
          this.selectedTier === 'All' ||
          template.tiers?.some(
            (tier: any) => tier.tierName === this.selectedTier
          );

        return categoryMatch && tierMatch;
      });

      this.cd.detectChanges();
    });
  }

  addToCart(
    template: {
      id: string;
      name: string;
      category: string;
      cover: string;
      tiers: string[];
    },
    tier: string,
    event: MouseEvent
  ) {
    event.stopPropagation();

    if (!tier) {
      alert('Please select a tier first.');
      return;
    }

    const priceMap: Record<'Basic' | 'Standard' | 'Premium', number> = {
      Basic: 29,
      Standard: 69,
      Premium: 129,
    };

    const typedTier = tier as 'Basic' | 'Standard' | 'Premium';

    const cartItem: CartItem = {
      name: template.name,
      tier: typedTier,
      price: priceMap[typedTier],
    };
    this.cartService.addItem(cartItem);
    alert(
      `Added "${cartItem.name}" (${cartItem.tier}) to cart for $${cartItem.price}`
    );
    this.cd.detectChanges();
  }

  isInCart(templateId: string, tier: string): boolean {
    return this.cartItems.some(
      (item) =>
        item.name === this.templates.find((t) => t.id === templateId)?.name &&
        item.tier === tier
    );
  }

  goToTemplate(id: string) {
    this.router.navigate(['/template', id]);
  }
}
