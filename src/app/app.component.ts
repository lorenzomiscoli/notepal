import { Component, OnInit } from '@angular/core';

import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { fromEvent, merge, switchMap } from 'rxjs';

import { LocaleService } from './services/locale.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private localeService: LocaleService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    addIcons(icons);
    this.localeService.registerLocales();
    this.ignoreGestures();
    this.onLanguageChange();
    this.onThemeChange();
  }

  // Workaround bug gestures with ripple effect. Ionic Github 22491
  private ignoreGestures(): void {
    window.addEventListener('ionGestureCaptured', (event: any) => {
      if (event.detail?.gestureName === 'long-press') {
        event.stopPropagation();
      }
    }, true
    );
  }

  private onLanguageChange(): void {
    this.settingsService.languageChange$.pipe(switchMap(() => this.settingsService.setInitialLanguage())).subscribe();
  }

  private onThemeChange(): void {
    merge(fromEvent(window.matchMedia('(prefers-color-scheme: dark)'), 'change'), this.settingsService.themeChange$)
      .pipe(switchMap(() => this.settingsService.setInitialTheme())).subscribe();
  }

}
