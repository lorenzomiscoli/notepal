import { LocaleService } from './services/locale.service';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { APP_DEPS } from './app.dependencies';
import * as icons from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [APP_DEPS],
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
