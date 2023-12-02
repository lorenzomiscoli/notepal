import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

export const NOTES_LIST_FOOTER_DEPS = [
  NgIf,
  RouterLink,
  IonFab,
  IonFabButton,
  IonIcon
];
