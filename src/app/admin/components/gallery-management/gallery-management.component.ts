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
  templateUrl: './gallery-management.component.html',
  styleUrl: './gallery-management.component.scss',
})
export class GalleryManagementComponent implements OnInit {
  showForm = false;
  @ViewChild('editAlbumTemplate') editAlbumTemplate!: TemplateRef<any>;
  @ViewChild('newAlbumTemplate') newAlbumTemplate!: TemplateRef<any>;
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
  newCoverImage: File | null = null;
  selectedPredefinedFeature: string[] = [];
  coverPhotoPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private popupService: PopupService,
    private popup: PopupService,
    private cdr: ChangeDetectorRef
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      demoLink: [''],
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

  onEditTemplate(event: any) {
    this.previewUrl = null;
    this.newCoverImage = null;
    this.activeLang = 'en';

    this.editAlbumForm = this.fb.group({
      name: [event.name || ''],
      description: [event.description || ''],
    });

    this.popup.open(this.editAlbumTemplate, {
      albumForm: this.templateForm,
      album: event,
      isLoading: true,
      close: () => {
        this.popup.close();
      },
      onSubmit: () => {
        if (this.templateForm.invalid) return;
      },
    });
  }

  openAddAlbumPopup() {
    this.pageState = 'add';
    // this.popup.open(this.newAlbumTemplate, {
    //   templateForm: this.templateForm,
    //   close: () => {
    //     this.popup.close();
    //   },
    // });
  }

  setActiveLang(lang: string) {
    this.activeLang = lang;
  }

  onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.newCoverImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdateAlbum(albumId: string) {
    const formValue = this.editAlbumForm.value;
    // this.store.dispatch(
    //   updateAlbum({
    //     albumId,
    //     updatedTitleEn: formValue.name.en,
    //     updatedTitleEs: formValue.name.es,
    //     updatedDescriptionEn: formValue.description.en,
    //     updatedDescriptionEs: formValue.description.es,
    //     newCoverPhotoFile: this.newCoverImage || undefined,
    //   })
    // );
    this.popup.close();
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
    console.log(this.templateForm.value);

    if (this.templateForm.invalid || !this.coverPhotoFile) {
      console.error('Form invalid or cover photo not selected');
      return;
    }

    const { name, description, category, demoLink, tutorialLink, tiers } =
      this.templateForm.value;

    this.store.dispatch(
      addTemplate({
        templateName: name,
        description: description,
        coverPhotoFile: this.coverPhotoFile,
        tiers: tiers,
        demoLink: demoLink,
        tutorialLink: tutorialLink,
        category: category,
      })
    );
    this.pageState = 'templates';
    this.templateForm.reset();
    this.coverPhotoFile = null;
    this.coverPhotoPreviewUrl = null;
    this.tiers.clear();
    this.previewUrl = null;
    this.newCoverImage = null;
    this.cdr.detectChanges();
    this.popup.close();
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
