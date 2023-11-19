import { NgIf, DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import {
  IonButtons,
  IonNote,
  IonButton,
  IonBackButton,
  IonToolbar,
  IonInput,
  IonIcon,
  IonTextarea,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonAlert
} from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

export const NOTES_SAVE_DEPS = [
  NgIf,
  DatePipe,
  ReactiveFormsModule,
  IonButtons,
  IonNote,
  IonButton,
  IonBackButton,
  IonToolbar,
  IonInput,
  IonIcon,
  IonTextarea,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonAlert,
  TranslateModule
]
