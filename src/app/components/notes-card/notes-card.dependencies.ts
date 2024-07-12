import { NgClass, NgStyle } from "@angular/common";

import { IonIcon, IonRippleEffect } from "@ionic/angular/standalone";

import { ReminderDateDirective } from "../../../app/directives/reminder-date.directive";
import { DateFormatterPipe } from "../../../app/pipes/date-formatter.directive";
import { SanitizeHtmlPipe } from "../../../app/pipes/sanitize-html.pipe";

export const NOTES_CARD_DEPS = [
  NgClass,
  NgStyle,
  IonIcon,
  IonRippleEffect,
  ReminderDateDirective,
  DateFormatterPipe,
  SanitizeHtmlPipe
];
