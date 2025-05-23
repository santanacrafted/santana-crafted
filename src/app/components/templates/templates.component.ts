import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Required for ngModel
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../shared/services/cart.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
export class TemplatesComponent implements OnInit {
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
  @ViewChild('filterBar') filterBar!: ElementRef;
  isSticky = false;
  filteredTemplates = JSON.parse(JSON.stringify(this.templates));

  categories: string[] = [
    'All',
    'Dashboard',
    'Organization',
    'Store',
    'Portfolio',
    'Church',
    'Art',
  ];

  tiers: string[] = ['All', 'Basic', 'Standard', 'Premium'];

  selectedCategory = 'All';
  selectedTier = 'All';

  // 🆕 Tier selection tracking
  selectedTiers: { [templateId: string]: string } = {};
  cartItems: CartItem[] = [];
  cartCount = 0;
  constructor(
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.autoSelectSingleTier();
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.length;

      this.applyFilters();
      this.syncSelectedTiersFromCart();
      this.applyFilters();
    });

    this.route.queryParams.subscribe((params) => {
      const tierParam = params['tier'];
      if (tierParam && this.tiers.includes(tierParam)) {
        this.selectedTier = tierParam;
      }
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItems = items;
        this.syncSelectedTiersFromCart();
        this.autoSelectSingleTier();
        this.applyFilters();
      });
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.filterBar) return;
    const top = this.filterBar.nativeElement.getBoundingClientRect().top;
    this.isSticky = top <= 24; // 'top-4' is 1rem = 16px + extra margin/padding
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterTier(tier: string) {
    this.selectedTier = tier;
    this.applyFilters();
  }

  goToTemplate(id: string) {
    this.router.navigate(['/template', id]);
  }

  applyFilters() {
    this.filteredTemplates = this.templates.filter((template) => {
      const categoryMatch =
        this.selectedCategory === 'All' ||
        template.category === this.selectedCategory;
      const tierMatch =
        this.selectedTier === 'All' ||
        template.tiers.includes(this.selectedTier);
      return categoryMatch && tierMatch;
    });
  }

  addToCart(template: any, tier: string, event: MouseEvent) {
    console.log(template);
    console.log(tier);

    console.log(event);

    event.stopPropagation();
    if (!tier) {
      alert('Please select a tier first.');
      return;
    }

    const priceMap: any = {
      Basic: 29,
      Standard: 69,
      Premium: 129,
    };

    const cartItem: CartItem = {
      name: template.name,
      tier: tier as 'Basic' | 'Standard' | 'Premium',
      price: priceMap[tier] || 0,
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
}
