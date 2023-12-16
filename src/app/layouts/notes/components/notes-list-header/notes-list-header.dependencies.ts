import { NgIf } from "@angular/common";

import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonRadio,
  IonRadioGroup
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_HEADER_DEPS = [
  NgIf,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonRadio,
  IonRadioGroup,
  TranslateModule
];
