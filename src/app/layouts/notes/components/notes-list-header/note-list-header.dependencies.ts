import { NgIf } from "@angular/common";

import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSearchbar,
  IonToolbar
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_HEADER_DEPS = [
  NgIf,
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSearchbar,
  IonToolbar,
  TranslateModule,
];
