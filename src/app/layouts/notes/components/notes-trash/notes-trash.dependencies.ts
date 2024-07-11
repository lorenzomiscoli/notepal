import { NgClass, NgFor } from '@angular/common';

import { IonBackButton, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMasonryModule } from 'ngx-masonry';

import { NotesCardComponent } from '../../../../components/notes-card/notes-card.component';
import { LongPressDirective } from '../../../../directives/long-press.directive';
import { SortNotesPipe } from '../../../../pipes/sort-property.pipe';
import { NotesTrashSelectedHeaderComponent } from '../notes-trash-selected-header/notes-trash-selected-header.component';

export const NOTES_TRASH_DEPS = [
  NgClass,
  NgFor,
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  TranslateModule,
  NgxMasonryModule,
  NotesCardComponent,
  LongPressDirective,
  SortNotesPipe,
  NotesTrashSelectedHeaderComponent
];
