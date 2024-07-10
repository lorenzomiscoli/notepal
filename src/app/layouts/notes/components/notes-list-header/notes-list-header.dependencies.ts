import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import {
  IonButton,
  IonButtons,
  IonIcon,
  IonModal,
  IonRadio,
  IonRadioGroup
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_HEADER_DEPS = [
  FormsModule,
  RouterLink,
  IonButton,
  IonButtons,
  IonIcon,
  IonModal,
  IonRadio,
  IonRadioGroup,
  TranslateModule
];
