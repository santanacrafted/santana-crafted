import { createReducer, on } from '@ngrx/store';
import * as TemplateActions from './templates.actions';

export interface TemplateState {
  templates: any[];
  loading: boolean;
  updateLoading: boolean;
  addLoading: boolean;
  deleteLoading: boolean;
}

export const initialState: TemplateState = {
  templates: [],
  loading: false,
  updateLoading: false,
  addLoading: false,
  deleteLoading: false,
};

export const templateReducer = createReducer(
  initialState,

  // Load all events
  on(TemplateActions.loadTemplates, (state) => ({
    ...state,
    loading: state.templates.length > 0 ? false : true,
  })),
  on(TemplateActions.loadTemplatesSuccess, (state, { templates }) => ({
    ...state,
    templates,
    loading: false,
  })),
  // Update template
  on(TemplateActions.updateTemplate, (state) => ({
    ...state,
    updateLoading: true,
  })),
  on(
    TemplateActions.updateTemplateSuccess,
    (state, { templateId, updatedFields }) => ({
      ...state,
      updateLoading: false,
      events: state.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              ...updatedFields,
            }
          : template
      ),
    })
  ),
  on(TemplateActions.updateTemplateFailure, (state) => ({
    ...state,
    updateLoading: false,
  })),
  // Add template
  on(TemplateActions.addTemplate, (state) => ({
    ...state,
    addLoading: true,
  })),
  on(TemplateActions.addTemplateSuccess, (state, { template }) => ({
    ...state,
    templates: [...state.templates, template],
    addLoading: false,
  })),
  on(TemplateActions.addTemplateFailure, (state) => ({
    ...state,
    addLoading: false,
  })),
  // Delete template
  on(TemplateActions.deleteTemplate, (state) => ({
    ...state,
    deleteLoading: true,
  })),
  on(TemplateActions.deleteTemplateSuccess, (state, { templateId }) => ({
    ...state,
    templates: state.templates.filter((t) => t.id !== templateId),
    deleteLoading: false,
  })),
  on(TemplateActions.deleteTemplateFailure, (state) => ({
    ...state,
    deleteLoading: false,
  }))
);
