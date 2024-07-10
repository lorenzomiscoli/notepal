import { Component, OnDestroy, OnInit, inject } from "@angular/core";

import { Subject, Subscription, take, takeUntil } from "rxjs";

import { AppLanguage, AppTheme } from "../../interfaces/setting.interface";
import { SettingsService } from "../../services/settings.service";
import { SETTINGS_DEPS } from "./settings.dependencies";

@Component({
  templateUrl: "./settings.component.html",
  standalone: true,
  imports: [SETTINGS_DEPS]
})
export class SettingsComponent implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  public theme = AppTheme.SYSTEM_DEFAULT;
  public language = AppLanguage.SYSTEM_DEFAULT;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;

  ngOnInit(): void {
    this.settingsService.findFirst().pipe(take(1)).subscribe(({ theme, language }) => {
      this.theme = theme;
      this.language = language;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  public onThemeChange(event: CustomEvent): void {
    const newTheme: AppTheme = event.detail.value;
    this.settingsService.updateTheme(newTheme).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public onLanguageChange(event: CustomEvent): void {
    const newLanguage: AppLanguage = event.detail.value;
    this.settingsService.updateLanguage(newLanguage).pipe(takeUntil(this.destroy$)).subscribe();
  }

}
