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

import { NotesColorPicker } from "../../../../components/notes-color-picker/notes-color-picker.component";
import { NotesDeleteAlertComponent } from "../../../../components/notes-delete-alert/notes-delete-alert.component";
import { NotesMoveComponent } from "../../../../components/notes-move/notes-move.component";

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
  NotesColorPicker,
  NotesDeleteAlertComponent,
  NotesMoveComponent
];
