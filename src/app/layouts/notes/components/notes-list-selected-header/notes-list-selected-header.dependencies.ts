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

import { NotesDeleteAlertComponent } from "../notes-delete-alert/notes-delete-alert.component";

export const NOTES_LIST_SELECTED_HEADER_DEPS = [
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonToast,
  TranslateModule,
  NotesDeleteAlertComponent
];
