import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TemplateState } from './templates.reducer';

// Select the entire gallery feature state
export const selectTemplateState =
  createFeatureSelector<TemplateState>('templateState');

// Select all gallery events
export const selectTemplates = createSelector(
  selectTemplateState,
  (state) => state.templates
);

export const selectTemplatesEventHasData = createSelector(
  selectTemplateState,
  (state) => state.templates.length > 0
);

export const selectTemplateLoading = createSelector(
  selectTemplateState,
  (state) => state.loading
);

export const selectAddTemplateLoading = createSelector(
  selectTemplateState,
  (state) => state.addLoading
);

export const selectUpdateTemplateLoading = createSelector(
  selectTemplateState,
  (state) => state.updateLoading
);

export const selectDeleteTemplateLoading = createSelector(
  selectTemplateState,
  (state) => state.deleteLoading
);
