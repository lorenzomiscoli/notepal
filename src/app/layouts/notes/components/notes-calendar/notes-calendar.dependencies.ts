import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";

import { IonDatetime, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { NotesCardComponent } from "../notes-card/notes-card.component";
import { SortNotesPipe } from "../../../../../app/pipes/sort-property.pipe";

export const NOTES_CALENDAR_DEPS = [
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  NgOptimizedImage,
  RouterLink,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonIcon,
  TranslateModule,
  NotesCardComponent,
  SortNotesPipe
];
