import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

import { Device, LanguageTag } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from, tap } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class LocaleService {

  constructor(private translateService: TranslateService){}

  public registerLocales(): void {
    registerLocaleData(localeIt, "it-IT", localeItExtra);
  }

  public setLanguage(): Observable<LanguageTag> {
    return from(Device.getLanguageTag()).pipe(tap((deviceLang) => {
      const availableLangs = this.translateService.getLangs();
      const lang = availableLangs.find(lang => lang === deviceLang.value) ? deviceLang.value : 'en-US';
      this.translateService.setDefaultLang(lang);
    }))
  }

}
