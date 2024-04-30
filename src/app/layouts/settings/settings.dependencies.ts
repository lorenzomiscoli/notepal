import { RouterLink } from "@angular/router";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const SETTINGS_DEPS = [
  RouterLink,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonButtons,
  IonBackButton,
  IonSelectOption,
  IonNote,
  TranslateModule
];
