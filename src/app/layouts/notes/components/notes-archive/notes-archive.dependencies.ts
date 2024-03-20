import { NgClass, NgFor, NgIf } from '@angular/common';

import { IonBackButton, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { NgxMasonryModule } from 'ngx-masonry';
import { TranslateModule } from '@ngx-translate/core';

import { LongPressDirective } from '../../../../directives/long-press.directive';
import { SortNotesPipe } from './../../../../pipes/sort-property.pipe';
import { NotesCardComponent } from '../../../../components/notes-card/notes-card.component';
import { NotesArchiveSelectedHeaderComponent } from '../notes-archive-selected-header/notes-archive-selected-header.component';

export const NOTES_ARCHIVE_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  NgxMasonryModule,
  TranslateModule,
  LongPressDirective,
  NotesCardComponent,
  SortNotesPipe,
  NotesArchiveSelectedHeaderComponent
];
