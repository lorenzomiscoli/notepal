import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NOTES_LIST_HEADER_DEPS } from "./note-list-header.dependencies";


@Component({
  selector: "app-notes-list-header",
  templateUrl: "./notes-list-header.component.html",
  standalone: true,
  imports: [NOTES_LIST_HEADER_DEPS]
})
export class NotesListHeaderComponent {
  @Input() public selectedMode = false;
  @Output() public onCancel = new EventEmitter<void>();
  @Output() public onSearch = new EventEmitter<string>();
  public filterValue = '';

  public search(event: any): void {
    this.filterValue = event.detail.value;
    this.onSearch.emit(event.detail.value);
  }

  public cancel(): void {
    this.onCancel.emit();
  }

}
