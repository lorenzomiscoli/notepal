import { Component, EventEmitter, Output } from "@angular/core";
import { NOTES_LIST_SEARCHBAR_DEPS } from "./notes-list-searchbar.dependencies";

@Component({
  selector: "app-notes-list-searchbar",
  templateUrl: "./notes-list-searchbar.component.html",
  styleUrls: ["./notes-list-searchbar.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_SEARCHBAR_DEPS]
})
export class NotesListSearchbarComponent {
  @Output() public search = new EventEmitter<string>();
  public filterValue = '';

  public onSearch(value: string): void {
    this.filterValue = value;
    this.search.emit(value);
  }

}
