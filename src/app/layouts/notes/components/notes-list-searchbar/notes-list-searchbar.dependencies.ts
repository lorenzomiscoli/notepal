import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_LIST_SEARCHBAR_DEPS = [
  NgIf,
  FormsModule,
  IonIcon,
  TranslateModule,
];
