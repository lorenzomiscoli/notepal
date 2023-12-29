import { Component } from "@angular/core";

import { IonRouterOutlet } from "@ionic/angular/standalone";

import { NotesService } from "./services/notes.service";
import { NotesSettingService } from "./services/notes-setting.service";
import { NotesCategoryService } from "./services/notes-category.service";

@Component({
  templateUrl: "./notes.component.html",
  standalone: true,
  imports: [IonRouterOutlet],
  providers: [NotesService, NotesSettingService, NotesCategoryService]
})
export class NotesComponent {

}
