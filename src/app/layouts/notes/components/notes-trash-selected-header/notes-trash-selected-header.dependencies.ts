import { IonAlert, IonButton, IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from "@ngx-translate/core";

import { NotesSelectedHeaderComponent } from "../../../../components/notes-selected-header/notes-selected-header.component";

export const NOTES_TRASH_SELECTED_HEADER_DEPS = [
  IonAlert,
  IonButton,
  IonIcon,
  TranslateModule,
  NotesSelectedHeaderComponent
];
