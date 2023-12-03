import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
  IonRadio,
  IonRadioGroup
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_HEADER_DEPS = [
  NgIf,
  FormsModule,
  IonButton,
  IonButtons,
  IonIcon,
  IonModal,
  TranslateModule,
  IonContent,
  IonRadioGroup,
  IonRadio
];
