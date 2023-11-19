import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { Capacitor } from '@capacitor/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

import { AppComponent } from './app/app.component';
import { InitializeAppService } from './app/services/initialize-app.service';
import { LocaleService } from './app/services/locale.service';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';

// Define translations
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Define database
export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}

// Define language
export function initializeLanguage(locale: LocaleService) {
  return () => locale.setLanguage();
}

if (environment.production) {
  enableProdMode();
}

/** SQL LITE */
const platform = Capacitor.getPlatform();
if (platform === "web") {
  // Web platform
  // required for toast component in Browser
  pwaElements(window);

  // required for jeep-sqlite Stencil component
  // to use a SQLite database in Browser
  jeepSqlite(window);

  window.addEventListener('DOMContentLoaded', async () => {
    const jeepEl = document.createElement("jeep-sqlite");
    document.body.appendChild(jeepEl);
    jeepEl.autoSave = true;
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideIonicAngular(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: "en",
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      deps: [LocaleService],
      multi: true
    }
  ],
});
