import { DatePipe } from "@angular/common";
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
import { NgxEditorModule } from "ngx-editor";

import { NotesEditorToolsComponent } from "../../../../../app/components/notes-editor-tools/notes-editor-tools.component";
import { NotesColorPickerComponent } from "../../../../components/notes-color-picker/notes-color-picker.component";
import { NotesManageReminderComponent } from "../../../../components/notes-manage-reminder/notes-manage-reminder.component";
import { NotesMoveComponent } from "../../../../components/notes-menu/components/notes-move/notes-move.component";
import { ReminderDateDirective } from "../../../../directives/reminder-date.directive";
import { DateFormatterPipe } from "../../../../pipes/date-formatter.directive";

export const NOTES_SAVE_DEPS = [
  DatePipe,
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
  NotesColorPickerComponent,
  NotesManageReminderComponent,
  NotesMoveComponent,
  ReminderDateDirective,
  DateFormatterPipe,
  NotesEditorToolsComponent,
  NgxEditorModule
]
