import { Component } from "@angular/core";

import { IonRouterOutlet } from "@ionic/angular/standalone";

import { NotesService } from "./services/notes.service";
import { NotesSettingService } from "./services/notes-setting.service";

@Component({
  templateUrl: "./notes.component.html",
  standalone: true,
  imports: [IonRouterOutlet],
  providers: [NotesService, NotesSettingService]
})
export class NotesComponent {

}
