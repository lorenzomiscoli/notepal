import { Component } from "@angular/core";

import { IonRouterOutlet } from "@ionic/angular/standalone";

import { NotesNotificationComponent } from "../../components/notes-notification/notes-notification.component";

@Component({
  templateUrl: "./notes.component.html",
  standalone: true,
  imports: [IonRouterOutlet, NotesNotificationComponent]
})
export class NotesComponent {

}
