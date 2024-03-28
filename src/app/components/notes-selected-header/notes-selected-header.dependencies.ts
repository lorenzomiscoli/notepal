import { NgIf } from "@angular/common";

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
import { NotesMenuComponent } from "../notes-menu/notes-menu.component";
import { NotesColorPicker } from "../notes-color-picker/notes-color-picker.component";

export const NOTES_SELECTED_HEADER_DEPS = [
  NgIf,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonToast,
  TranslateModule,
  NotesMenuComponent,
  NotesColorPicker
];
