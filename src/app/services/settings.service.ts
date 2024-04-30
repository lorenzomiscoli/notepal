import { Inject, Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from "@capacitor-community/sqlite";
import { Observable, Subject, forkJoin, map, tap } from "rxjs";
import { from } from "rxjs/internal/observable/from";

import { AppLanguage, AppTheme, Setting } from "../interfaces/setting.interface";
import { StorageService } from "./storage.service";
import { Device, GetLanguageCodeResult } from "@capacitor/device";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  public readonly languageChange$ = new Subject<AppLanguage>();
  public readonly themeChange$ = new Subject<AppTheme>();

  constructor(private storageService: StorageService, private translateService: TranslateService, @Inject(DOCUMENT) private document: Document) { }

  public findFirst(): Observable<Setting> {
    return from(this.storageService.db.query(`SELECT
    id,
    theme,
    language
  FROM
    setting
  WHERE
    id = 1
  `)).pipe(map((value: DBSQLiteValues) => {
      const settings = value.values as Setting[];
      return settings[0];
    }));
  }

  public updateTheme(theme: AppTheme): Observable<number> {
    const sql = `UPDATE setting SET theme = ? WHERE id = 1;`;
    return from(this.storageService.db.run(sql, [theme], true)).pipe(
      map((value: capSQLiteChanges) => value.changes?.lastId as number),
      tap(() => this.themeChange$.next(theme)));
  }

  public updateLanguage(language: AppLanguage): Observable<number> {
    const sql = `UPDATE setting SET language = ? WHERE id = 1;`;
    return from(this.storageService.db.run(sql, [language], true)).pipe(
      map((value: capSQLiteChanges) => value.changes?.lastId as number),
      tap(() => this.languageChange$.next(language)));
  }

  public setInitialTheme(): Observable<Setting> {
    return this.findFirst().pipe(tap((setting) => {
      const themeClass = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (setting.theme == AppTheme.SYSTEM_DEFAULT) {
        this.addThemeClass(themeClass);
      } else {
        if (setting.theme == AppTheme.LIGHT_THEME) {
          this.addThemeClass("light");
        } else {
          this.addThemeClass("dark");
        }
      }
    }))
  }

  public setInitialLanguage(): Observable<[GetLanguageCodeResult, Setting]> {
    return forkJoin([from(Device.getLanguageCode()), this.findFirst()]).pipe(tap(values => {
      const deviceLang = values[0];
      const settings = values[1];
      if (settings.language == AppLanguage.SYSTEM_DEFAULT) {
        this.translateService.use(deviceLang.value);
      } else {
        this.translateService.use(settings.language);
      }
    }));
  }

  private addThemeClass(classValue: string) {
    if (classValue === 'dark') {
      this.document.body.classList.remove("light");
      this.document.body.classList.add("dark");
    } else {
      this.document.body.classList.remove("dark");
      this.document.body.classList.add("light");
    }

  }

}
