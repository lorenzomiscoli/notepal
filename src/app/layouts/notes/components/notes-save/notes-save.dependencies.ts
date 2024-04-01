import { DatePipe, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NotesMenuComponent } from './../../../../components/notes-menu/notes-menu.component';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonLabel,
  IonTextarea
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

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
  TranslateModule,
  NotesMenuComponent
]
