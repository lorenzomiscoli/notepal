import { Component } from "@angular/core";

import { IonRouterOutlet } from "@ionic/angular/standalone";

import { NotesService } from "./services/notes.service";

@Component({
  templateUrl: "./notes.component.html",
  standalone: true,
  imports: [IonRouterOutlet],
  providers: [NotesService]
})
export class NotesComponent {

}
