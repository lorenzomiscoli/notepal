import { NgClass, NgFor, NgIf, NgOptimizedImage, NgStyle } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonButton, IonButtons, IonChip, IonContent, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { LongPressDirective } from "../../../../../app/directives/long-press.directive";
import { NotesCardComponent } from "../notes-card/notes-card.component";

export const NOTES_SEARCH_DEPS = [
  NgClass,
  NgFor,
  NgStyle,

  NgIf,
  NgOptimizedImage,
  FormsModule,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonIcon,
  TranslateModule,
  LongPressDirective,
  NotesCardComponent
];
