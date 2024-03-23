import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonToast
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";
import { NotesMoveComponent } from "../notes-move/notes-move.component";

export const NOTES_MENU_DEPS = [
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonToast,
  TranslateModule,
  NotesMoveComponent
];
