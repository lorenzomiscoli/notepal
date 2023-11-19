import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

import { Device, GetLanguageCodeResult } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from, tap } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class LocaleService {

  constructor(private translateService: TranslateService){}

  public registerLocales(): void {
    registerLocaleData(localeIt, "it", localeItExtra);
  }

  public setLanguage(): Observable<GetLanguageCodeResult> {
    return from(Device.getLanguageCode()).pipe(tap((deviceLang) => {
      this.translateService.use(deviceLang.value);
    }));
  }

}
