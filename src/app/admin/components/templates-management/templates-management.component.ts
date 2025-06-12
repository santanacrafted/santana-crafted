import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Functions } from '@angular/fire/functions';
import { Storage } from '@angular/fire/storage';
import {
  addTemplate,
  deleteTemplate,
  loadTemplates,
  updateTemplate,
} from '../../../state/templates/templates.actions';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, take } from 'rxjs';
import {
  selectAddTemplateLoading,
  selectDeleteTemplateLoading,
  selectTemplateLoading,
  selectTemplates,
  selectUpdateTemplateLoading,
} from '../../../state/templates/templates.selector';
import { PopupService } from '../../../shared/services/popup/popup.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-gallery-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AutocompleteComponent,
  ],
  templateUrl: './templates-management.component.html',
  styleUrl: './templates-management.component.scss',
})
export class TemplatesManagementComponent implements OnInit {
  showForm = false;
  @ViewChild('tiersContainer') tiersContainer!: ElementRef;
  pageState: 'add' | 'edit' | 'templates' = 'templates';
  templateForm: FormGroup;
  coverPhotoFile: File | null = null;
  imageFiles: File[] = [];
  functions = inject(Functions);
  storage = inject(Storage);
  templates$?: Observable<any[]>;
  selectTemplatesLoading$?: Observable<boolean>;
  selectDeleteTemplatesLoading$?: Observable<boolean>;
  selectUpdateTemplatesLoading$?: Observable<boolean>;
  selectCreateTemplatesLoading$?: Observable<boolean>;
  images$: Observable<string[]> = of([]);
  selectedImages$: Observable<string[]> = of([]);
  galleryView: 'events-gallery' | 'event-images' = 'events-gallery';
  add: boolean = false;
  selectedAlbum: any = null;
  selectedAlbumImages: { name: string; downloadUrl: string }[] = [];
  selectAll = false;
  supportedLanguages = ['en', 'es'];
  activeLang = 'en';
  editAlbumForm!: FormGroup;
  templateToEdit: any = null;
  predefinedFeatures = [
    'Responsive Design',
    'SEO Optimized',
    'Dark Mode Support',
    'Dynamic Forms',
    'User Authentication',
    'Admin Dashboard',
    'Multi-language Support',
    'Analytics Integration',
  ];
  form = {
    name: {} as Record<string, string>,
    description: {} as Record<string, string>,
  };

  previewUrl: string | null = null;
  selectedPredefinedFeature: string[] = [];
  coverPhotoPreviewUrl: string | File | null = null;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private popup: PopupService,
    private cdr: ChangeDetectorRef
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      tiers: this.fb.array([]),
    });
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
  }

  ngOnInit(): void {
    this.store.dispatch(loadTemplates());
  }

  getLangControl(groupName: 'name' | 'description', lang: string): FormControl {
    return this.editAlbumForm.get([groupName, lang]) as FormControl;
  }

  onEditTemplate(template: any) {
    console.log('Editing template:', template);
    this.templateToEdit = template;
    this.pageState = 'edit';
    // Reset form
    this.templateForm.reset();

    // Prefill form basic fields
    this.templateForm.patchValue({
      name: template.name || '',
      description: template.description || '',
      category: template.category || '',
    });

    // Set cover photo preview (you cannot set coverPhotoFile unless the user uploads it again)
    this.coverPhotoPreviewUrl = template.coverImage || '';

    // Clear tiers FormArray
    this.tiers.clear();

    // Rebuild tiers
    if (template.tiers && Array.isArray(template.tiers)) {
      template.tiers.forEach((tier: any) => {
        const tierGroup = this.fb.group({
          tierName: this.fb.nonNullable.control(
            tier.tierName || '',
            Validators.required
          ),
          tierDemoLink: this.fb.nonNullable.control(tier.tierDemoLink || ''),
          tierTutorialLink: this.fb.nonNullable.control(
            tier.tierTutorialLink || ''
          ),
          features: this.fb.array<FormControl<string>>([]),
        });

        // Prefill features
        const featuresArray = tierGroup.get('features') as FormArray;
        if (tier.features && Array.isArray(tier.features)) {
          tier.features.forEach((feature: string) => {
            featuresArray.push(this.fb.control(feature));
          });
        }

        // Add the tier group to the FormArray
        this.tiers.push(tierGroup);
      });
    }

    // Optional: If you want to reset the formSubmitted flag when editing
    this.formSubmitted = false;
  }

  setActiveLang(lang: string) {
    this.activeLang = lang;
  }

  onUpdateAlbum(templateId: string) {
    this.formSubmitted = true;

    if (
      this.templateForm.invalid ||
      (!this.coverPhotoFile && !this.templateToEdit?.coverImage)
    ) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const { name, description, category, tiers } = this.templateForm.value;

    this.store.dispatch(
      updateTemplate({
        templateId,
        updatedTitle: name,
        updatedDescription: description,
        newCoverPhotoFile: this.coverPhotoFile || undefined,
        tiers: tiers,
        category: category,
      })
    );

    this.clearForm();
  }

  onCoverPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.coverPhotoFile = input.files[0];
      this.coverPhotoPreviewUrl = URL.createObjectURL(this.coverPhotoFile);
    }
  }

  onFeatureInput(tierIndex: number, featureIndex: number, value: string) {
    const featuresArray = this.getFeatures(tierIndex);
    featuresArray.at(featureIndex).setValue(value);
  }

  async onCreateAlbum() {
    this.formSubmitted = true;

    if (this.templateForm.invalid || !this.coverPhotoFile) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const { name, description, category, tiers } = this.templateForm.value;

    this.store.dispatch(
      addTemplate({
        templateName: name,
        description: description,
        coverPhotoFile: this.coverPhotoFile,
        tiers: tiers,
        category: category,
      })
    );
    this.clearForm();
    this.cdr.detectChanges();
    this.popup.close();
  }

  clearForm() {
    this.templateForm.reset();
    this.coverPhotoFile = null;
    this.coverPhotoPreviewUrl = null;
    this.tiers.clear();
    this.previewUrl = null;
    this.templateToEdit = null;
    this.formSubmitted = false;
    this.pageState = 'templates';
    this.cdr.detectChanges();
  }
  onDeleteAlbum(templateId: string): void {
    this.store.dispatch(
      deleteTemplate({
        templateId,
      })
    );
  }

  get tiers(): FormArray<FormGroup> {
    return this.templateForm.get('tiers') as FormArray<FormGroup>;
  }

  getFeatures(tierIndex: number): FormArray<FormControl<string>> {
    return this.tiers.at(tierIndex).get('features') as FormArray<
      FormControl<string>
    >;
  }

  addTier(): void {
    const tierGroup = this.fb.group({
      tierName: this.fb.nonNullable.control('', Validators.required),
      tierDemoLink: this.fb.nonNullable.control(''),
      tierTutorialLink: this.fb.nonNullable.control(''),
      features: this.fb.array<FormControl<string>>([]),
    });
    this.tiers.push(tierGroup);
    this.cdr.detectChanges();
  }

  removeTier(index: number): void {
    this.tiers.removeAt(index);
  }

  addFeature(tierIndex: number): void {
    this.getFeatures(tierIndex).push(
      this.fb.nonNullable.control('', Validators.required)
    );
  }

  removeFeature(tierIndex: number, featureIndex: number): void {
    this.getFeatures(tierIndex).removeAt(featureIndex);
  }

  scrollTiers(direction: 'left' | 'right') {
    const container = this.tiersContainer.nativeElement;
    const scrollAmount =
      this.tiersContainer.nativeElement.getBoundingClientRect().width + 16;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onContainerWheel(event: WheelEvent) {
    const target = event.target as HTMLElement;

    // If the target is scrollable in Y, do not prevent
    const isScrollable = target.scrollHeight > target.clientHeight;

    if (!isScrollable) {
      event.preventDefault();
    }
  }

  addTierAndScroll() {
    this.addTier();

    // Delay scrolling a bit so DOM updates first
    setTimeout(() => {
      this.scrollTiers('right');
    }, 100);
  }
}
