import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { NotesMoveComponent } from "./components/notes-move/notes-move.component";

export const NOTES_MENU_DEPS = [
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  TranslateModule,
  NotesMoveComponent
];
