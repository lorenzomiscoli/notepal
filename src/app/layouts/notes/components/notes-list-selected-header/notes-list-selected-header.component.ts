import { Component, EventEmitter, Output } from "@angular/core";

import { NOTES_LIST_SELECTED_HEADER_DEPS } from "./notes-list-selected-header.dependencies";

@Component({
  selector: "app-notes-list-selected-header",
  templateUrl: "./notes-list-selected-header.component.html",
  styleUrls: ["./notes-list-selected-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_SELECTED_HEADER_DEPS]
})
export class NotesListSelectedHeaderComponent {
  @Output() public close = new EventEmitter<void>();

  public cancel(): void {
    this.close.emit();
  }

}
