import { NgFor, NgIf, NgStyle } from "@angular/common";
import { RouterLink } from "@angular/router";

import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonRippleEffect
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { LongPressDirective } from './../../../../directives/long-press.directive';
import { NotesCategoriesSelectedHeader } from "../notes-categories-selected-header/notes-categories-selected-header.component";

export const NOTES_CATEGORIES_DEPS = [
  NgFor,
  NgIf,
  NgStyle,
  RouterLink,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonAlert,
  IonRippleEffect,
  TranslateModule,
  LongPressDirective,
  NotesCategoriesSelectedHeader
];
