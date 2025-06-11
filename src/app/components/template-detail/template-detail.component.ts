import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
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
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(loadTemplates());
    this.templateId = this.route.snapshot.paramMap.get('id')!;
    this.templates$ = this.store.select(selectTemplates);
    this.templates$.subscribe((templates) => {
      this.template = templates.find((x) => x.id === this.templateId);
      this.selectedTier = this.template?.tiers?.[0];
    });
  }
}
