import { IonButton, IonButtons, IonIcon } from "@ionic/angular/standalone";

import { NotesColorPicker } from "../../../../components/notes-color-picker/notes-color-picker.component";
import { NotesMenuComponent } from "../../../../components/notes-menu/notes-menu.component";
import { NotesMoveComponent } from "../../../../components/notes-move/notes-move.component";

export const NOTES_LIST_SELECTED_HEADER_DEPS = [
  IonButton,
  IonButtons,
  IonIcon,
  NotesColorPicker,
  NotesMenuComponent,
  NotesMoveComponent
];
