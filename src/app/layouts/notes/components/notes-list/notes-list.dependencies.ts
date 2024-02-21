import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonToolbar
} from '@ionic/angular/standalone';
import { NgxMasonryModule } from 'ngx-masonry';
import { TranslateModule } from '@ngx-translate/core';

import { FilterPropertyPipe } from '../../../../pipes/filter-property.pipe';
import { LineClampPipe } from '../../../../pipes/line-clamp.pipe';
import { LongPressDirective } from '../../../../directives/long-press.directive';
import { NotesListFooterComponent } from '../notes-list-footer/notes-list-footer.component';
import { NotesListHeaderComponent } from '../notes-list-header/notes-list-header.component';
import { NotesListSelectedHeaderComponent } from '../notes-list-selected-header/notes-list-selected-header.component';
import { SortNotesPipe } from './../../../../pipes/sort-property.pipe';
import { NotesCardComponent } from '../notes-card/notes-card.component';

export const NOTES_LIST_DEPS = [
  NgClass,
  NgFor,
  NgIf,
  RouterLink,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonToolbar,
  NgxMasonryModule,
  TranslateModule,
  FilterPropertyPipe,
  LineClampPipe,
  LongPressDirective,
  NotesListFooterComponent,
  NotesListHeaderComponent,
  NotesListSelectedHeaderComponent,
  NotesCardComponent,
  SortNotesPipe
]
