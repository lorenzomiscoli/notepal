import { NgClass, NgStyle } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonButton, IonButtons, IonChip, IonContent, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";
import { NgxMasonryModule } from 'ngx-masonry';

import { LongPressDirective } from "../../../../../app/directives/long-press.directive";
import { NotesCardComponent } from "../../../../components/notes-card/notes-card.component";

export const NOTES_SEARCH_DEPS = [
  NgClass,
  NgStyle,
  FormsModule,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonIcon,
  NgxMasonryModule,
  TranslateModule,
  LongPressDirective,
  NotesCardComponent
];
