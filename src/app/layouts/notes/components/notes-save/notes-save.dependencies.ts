import { DatePipe, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTextarea,
  IonToast
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { NotesColorPicker } from "../../../../components/notes-color-picker/notes-color-picker.component";
import { NotesManageReminder } from "../../../../components/notes-manage-reminder/notes-manage-reminder.component";
import { NotesMoveComponent } from "../../../../components/notes-menu/components/notes-move/notes-move.component";
import { ReminderDateDirective } from "../../../../directives/reminder-date.directive";
import { DateFormatterPipe } from "../../../../pipes/date-formatter.directive";

export const NOTES_SAVE_DEPS = [
  DatePipe,
  NgIf,
  ReactiveFormsModule,
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTextarea,
  IonToast,
  TranslateModule,
  NotesColorPicker,
  NotesManageReminder,
  NotesMoveComponent,
  ReminderDateDirective,
  DateFormatterPipe
]
