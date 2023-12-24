import { Component } from "@angular/core";

import { NOTES_TABS_DEPS } from "./notes-tabs.dependencies";

@Component({
  templateUrl: "./notes-tabs.component.html",
  styleUrls: ["./notes-tabs.component.scss"],
  standalone: true,
  imports: [NOTES_TABS_DEPS]
})
export class NotesTabsComponent {

}
