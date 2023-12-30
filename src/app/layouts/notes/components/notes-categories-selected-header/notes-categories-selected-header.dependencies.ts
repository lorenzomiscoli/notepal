import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

import {
  IonAlert,
  IonButton,
  IonButtons,
  IonIcon
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_CATEGORIES_SELECTED_HEADER_DEPS = [
  NgIf,
  RouterLink,
  IonButton,
  IonButtons,
  IonIcon,
  IonAlert,
  TranslateModule,
];
