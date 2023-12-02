import { Component, Input } from "@angular/core";

import { NOTES_LIST_FOOTER_DEPS } from "./notes-list-footer.dependencies";

@Component({
  selector: "app-notes-list-footer",
  templateUrl: "./notes-list-footer.component.html",
  standalone: true,
  imports: [NOTES_LIST_FOOTER_DEPS]
})
export class NotesListFooterComponent {
  @Input() public selectedMode!: boolean;

}
