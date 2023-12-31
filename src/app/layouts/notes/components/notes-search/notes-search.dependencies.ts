import { NgClass, NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonContent, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { LongPressDirective } from "../../../../../app/directives/long-press.directive";
import { NotesCardComponent } from "../notes-card/notes-card.component";

export const NOTES_SEARCH_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  NgOptimizedImage,
  FormsModule,
  IonContent,
  IonIcon,
  TranslateModule,
  LongPressDirective,
  NotesCardComponent
];
