import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  IonButton,
  IonButtons,
  IonIcon
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_HEADER_DEPS = [
  NgIf,
  FormsModule,
  IonButton,
  IonButtons,
  IonIcon,
  TranslateModule
];
