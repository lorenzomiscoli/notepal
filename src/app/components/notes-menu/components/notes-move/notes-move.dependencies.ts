import { AsyncPipe, NgFor, NgIf } from "@angular/common";

import { IonModal, IonRadio, IonRadioGroup } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_MOVE_DEPS = [
  AsyncPipe,
  NgFor,
  NgIf,
  IonModal,
  IonRadioGroup,
  IonRadio,
  TranslateModule
];
