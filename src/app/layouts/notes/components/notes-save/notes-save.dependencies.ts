import { DatePipe, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";


import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonLabel,
  IonTextarea,
  IonToast
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { NotesColorPicker } from "../../../../components/notes-color-picker/notes-color-picker.component";
import { NotesReminder } from "../../../../components/notes-reminder/notes-reminder.component";
import { NotesMenuComponent } from './../../../../components/notes-menu/notes-menu.component';

export const NOTES_SAVE_DEPS = [
  DatePipe,
  NgIf,
  ReactiveFormsModule,
  IonButtons,
  IonButton,
  IonBackButton,
  IonInput,
  IonIcon,
  IonTextarea,
  IonLabel,
  IonToast,
  TranslateModule,
  NotesReminder,
  NotesMenuComponent,
  NotesColorPicker
]
