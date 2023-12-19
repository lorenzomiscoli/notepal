import { Component, EventEmitter, Input, Output } from "@angular/core";

import { NOTES_LIST_SELECTED_HEADER_DEPS } from "./notes-list-selected-header.dependencies";
import { Note } from "../../interfaces/note.interface";

@Component({
  selector: "app-notes-list-selected-header",
  templateUrl: "./notes-list-selected-header.component.html",
  styleUrls: ["./notes-list-selected-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_SELECTED_HEADER_DEPS]
})
export class NotesListSelectedHeaderComponent {
  @Output() public close = new EventEmitter<void>();
  @Input({ required: true }) notes!: Note[];
  public isDeleteAlertOpen = false;

  public cancel(): void {
    this.close.emit();
  }

  public getSelectedNotes(): Note[] {
    return this.notes.filter(note => note.isSelected === true);
  }

  public isSelected(): boolean {
    return this.notes.find(note => note.isSelected === true) ? true : false;
  }

  public select(): void {
    const selectedNotes = this.notes.filter(note => note.isSelected === true).length;
    if (selectedNotes === this.notes.length) {
      this.notes.forEach(note => note.isSelected = false);
    } else {
      this.notes.forEach(note => note.isSelected = true);
    }
  }

  public toggleDeleteAlert(isOpen: boolean): void {
    this.isDeleteAlertOpen = isOpen;
  }

}
