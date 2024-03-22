import { LocaleService } from './services/locale.service';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import * as icons from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private localeService: LocaleService) { }

  ngOnInit(): void {
    addIcons(icons);
    this.localeService.registerLocales();
    this.ignoreGestures();
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

}
