import { NgClass, NgFor, NgIf, NgStyle } from "@angular/common";

import { IonIcon, IonModal } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_COLOR_PICKER_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
  IonIcon,
  IonModal,
  TranslateModule
];
