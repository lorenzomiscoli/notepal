import { AsyncPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonToolbar
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { FilterPropertyPipe } from '../../../../pipes/filter-property.pipe';
import { LineClampPipe } from '../../../../pipes/line-clamp.pipe';
import { LongPressDirective } from '../../../../directives/long-press.directive';

export const NOTES_LIST_DEPS = [
  AsyncPipe,
  NgFor,
  RouterLink,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonToolbar,
  TranslateModule,
  FilterPropertyPipe,
  LineClampPipe,
  LongPressDirective
]
