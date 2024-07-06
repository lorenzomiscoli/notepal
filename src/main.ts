import { HttpClient, provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { Capacitor } from '@capacitor/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { NgxEditorModule } from 'ngx-editor';
import { from, switchMap } from 'rxjs';
import { routes } from './app/app.routes';

import { AppComponent } from './app/app.component';
import { editorIcons, editorLocals } from './app/components/notes-editor-tools/editor-conf';
import { InitializeAppService } from './app/services/initialize-app.service';
import { SettingsService } from './app/services/settings.service';
import { environment } from './environments/environment';

// Define translations
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Define database, language and theme
export function initializeFactory(init: InitializeAppService, setting: SettingsService) {
  return () => from(init.initializeApp())
    .pipe(switchMap(() => setting.setInitialLanguage()), switchMap(() => setting.setInitialTheme()));
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
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        defaultLanguage: "en",
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      NgxEditorModule.forRoot({
        icons: editorIcons,
        locals:editorLocals
      })
    ),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService, SettingsService],
      multi: true
    }
  ],
});
