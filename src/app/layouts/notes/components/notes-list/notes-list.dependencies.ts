import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IonFab, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMasonryModule } from 'ngx-masonry';

import { NotesSelectedHeaderComponent } from 'src/app/components/notes-selected-header/notes-selected-header.component';
import { NotesCardComponent } from '../../../../components/notes-card/notes-card.component';
import { LongPressDirective } from '../../../../directives/long-press.directive';
import { FilterPropertyPipe } from '../../../../pipes/filter-property.pipe';
import { LineClampPipe } from '../../../../pipes/line-clamp.pipe';
import { NotesListHeaderComponent } from '../notes-list-header/notes-list-header.component';
import { SortNotesPipe } from './../../../../pipes/sort-property.pipe';

export const NOTES_LIST_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  RouterLink,
  IonFab,
  IonIcon,
  TranslateModule,
  NgxMasonryModule,
  FilterPropertyPipe,
  LineClampPipe,
  LongPressDirective,
  NotesListHeaderComponent,
  NotesCardComponent,
  SortNotesPipe,
  NotesSelectedHeaderComponent
]
