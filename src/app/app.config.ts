import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { loadTranslations } from './translation.loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  provideFirebaseApp,
  initializeApp,
  FirebaseOptions,
} from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import {
  provideFirestore,
  initializeFirestore,
  persistentLocalCache,
} from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { templateReducer } from './state/templates/templates.reducer';
import { analyticsReducer } from './state/analytics/analytics.reducer';
import { TemplatesEffects } from './state/templates/templates.effect';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig = (
  firebaseConfig: FirebaseOptions
): ApplicationConfig => ({
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFunctions(() => getFunctions(undefined, 'us-central1')),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() =>
      initializeFirestore(initializeApp(firebaseConfig), {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true,
        localCache: persistentLocalCache(),
      })
    ),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: () => loadTranslations,
      multi: true,
      deps: [],
    },
    provideStore(),
    provideState({ name: 'templateState', reducer: templateReducer }),
    provideState({ name: 'analyticsState', reducer: analyticsReducer }),
    provideEffects([TemplatesEffects]),
    provideStoreDevtools({}),
  ],
});
