import { NgClass } from '@angular/common';

import { IonBackButton, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMasonryModule } from 'ngx-masonry';

import { NotesCardComponent } from '../../../../components/notes-card/notes-card.component';
import { LongPressDirective } from '../../../../directives/long-press.directive';
import { NotesArchiveSelectedHeaderComponent } from '../notes-archive-selected-header/notes-archive-selected-header.component';
import { SortNotesPipe } from './../../../../pipes/sort-property.pipe';

export const NOTES_ARCHIVE_DEPS = [
  NgClass,
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
