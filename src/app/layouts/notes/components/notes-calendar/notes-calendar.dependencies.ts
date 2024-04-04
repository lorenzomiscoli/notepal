import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";

import { IonDatetime, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";
import { NgxMasonryModule } from 'ngx-masonry';

import { SortNotesPipe } from "../../../../../app/pipes/sort-property.pipe";
import { NotesCardComponent } from "../../../../components/notes-card/notes-card.component";

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
  NgxMasonryModule,
  TranslateModule,
  NotesCardComponent,
  SortNotesPipe
];
