import { Injectable } from '@angular/core';
import { TemplateService } from '../../shared/services/templates.service';
import {
  loadTemplates,
  loadTemplatesSuccess,
  updateTemplate,
  updateTemplateSuccess,
  updateTemplateFailure,
  addTemplate,
  addTemplateSuccess,
  addTemplateFailure,
  deleteTemplate,
  deleteTemplateSuccess,
  deleteTemplateFailure,
} from './templates.actions';
import {
  map,
  mergeMap,
  catchError,
  of,
  from,
  withLatestFrom,
  filter,
} from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { selectTemplatesEventHasData } from './templates.selector';

@Injectable()
export class TemplatesEffects {
  loadTemplatesEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTemplates),
      withLatestFrom(this.store.pipe(select(selectTemplatesEventHasData))),
      filter(([_, hasData]) => !hasData),
      mergeMap(() => {
        return this.templateService.getTemplates().pipe(
          map((templates) => loadTemplatesSuccess({ templates })),
          catchError((error) =>
            of({ type: '[Event Gallery] Load Gallery Events Failure', error })
          )
        );
      })
    )
  );

  updateTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTemplate),
      mergeMap(
        ({
          templateId,
          updatedTitle,
          updatedDescription,
          demoLink,
          tiers,
          tutorialLink,
          newCoverPhotoFile,
          category,
        }) =>
          from(
            this.templateService.updateTemplate(
              templateId,
              updatedTitle,
              updatedDescription,
              newCoverPhotoFile,
              tiers,
              demoLink,
              tutorialLink,
              category
            )
          ).pipe(
            map((res) => {
              return updateTemplateSuccess({
                templateId,
                updatedFields: {
                  name: updatedTitle,
                  description: updatedDescription,
                  demoLink: demoLink,
                  tiers: tiers,
                  category: category,
                  updatedAt: new Date().toISOString(),
                  tutorialLink: tutorialLink,
                  ...(res.data.coverImage && {
                    coverImage: res.data.coverImage,
                  }),
                },
              });
            }),
            catchError((error) => of(updateTemplateFailure({ error })))
          )
      )
    )
  );

  addTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTemplate),
      mergeMap(
        ({
          templateName,
          description,
          coverPhotoFile,
          tiers,
          demoLink,
          tutorialLink,
          category,
        }) => {
          return from(
            this.templateService.addTemplate(
              templateName,
              description,
              tiers,
              demoLink,
              tutorialLink,
              coverPhotoFile,
              category
            )
          ).pipe(
            map((res: any) => {
              return addTemplateSuccess({
                template: {
                  id: res.templateId,
                  name: templateName,
                  description: description,
                  coverImage: res.coverPhotoUrl,
                  tiers: tiers,
                  demoLink: demoLink,
                  tutorialLink: tutorialLink,
                  category: category,
                  createdAt: new Date().toISOString(),
                },
              });
            }),
            catchError((error) => of(addTemplateFailure({ error })))
          );
        }
      )
    )
  );

  deleteTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTemplate),
      mergeMap(({ templateId }) =>
        from(this.templateService.deleteTemplate(templateId)).pipe(
          map(() => deleteTemplateSuccess({ templateId })),
          catchError((error) => of(deleteTemplateFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private templateService: TemplateService
  ) {}
}
