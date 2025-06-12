import { createAction, props } from '@ngrx/store';
import { Template } from '../../components/templates/templates.model';

export const loadTemplates = createAction('[Templates] Load Templates');

export const loadTemplatesSuccess = createAction(
  '[Templates] Load Templates Success',
  props<{ templates: Template[] }>()
);

export const addTemplate = createAction(
  '[Templates] Create Template',
  props<{
    templateName: string;
    description: string;
    coverPhotoFile: File;
    tiers: string[];
    category: string;
  }>()
);

export const addTemplateSuccess = createAction(
  '[Templates] Create Template Success',
  props<{ template: any }>()
);

// Trigger template update
export const updateTemplate = createAction(
  '[Templates] Update Template',
  props<{
    templateId: string;
    updatedTitle: string;
    updatedDescription: string;
    newCoverPhotoFile?: File;
    tiers?: any[];
    category?: string;
  }>()
);

// Success
export const updateTemplateSuccess = createAction(
  '[Templates] Update Template Success',
  props<{ templateId: string; updatedFields: any }>() // could include title/desc/coverUrl
);

// Failure
export const updateTemplateFailure = createAction(
  '[Templates] Update Template Failure',
  props<{ error: any }>()
);

export const addTemplateFailure = createAction(
  '[Templates] Create Template Failure',
  props<{ error: any }>()
);

export const deleteTemplate = createAction(
  '[Templates] Delete Template',
  props<{ templateId: string }>()
);

export const deleteTemplateSuccess = createAction(
  '[Templates] Delete Template Success',
  props<{ templateId: string }>()
);

export const deleteTemplateFailure = createAction(
  '[Templates] Delete Template Failure',
  props<{ error: any }>()
);
