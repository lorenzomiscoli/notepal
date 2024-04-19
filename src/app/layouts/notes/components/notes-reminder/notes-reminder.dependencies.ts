import { NgClass, NgFor, NgIf } from '@angular/common';

import { IonBackButton, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMasonryModule } from 'ngx-masonry';

import { NotesSelectedHeaderComponent } from 'src/app/components/notes-selected-header/notes-selected-header.component';
import { NotesCardComponent } from '../../../../components/notes-card/notes-card.component';
import { LongPressDirective } from '../../../../directives/long-press.directive';
import { SortNotesPipe } from './../../../../pipes/sort-property.pipe';

export const NOTES_REMINDER_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  TranslateModule,
  NgxMasonryModule,
  NotesSelectedHeaderComponent,
  NotesCardComponent,
  LongPressDirective,
  SortNotesPipe
]
