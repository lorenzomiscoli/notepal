import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { NOTES_LIST_HEADER_DEPS } from "./notes-list-header.dependencies";
import { ViewMode } from "../../interfaces/note.interface";

@Component({
  selector: "app-notes-list-header",
  templateUrl: "./notes-list-header.component.html",
  styleUrls: ["./notes-list-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_HEADER_DEPS]
})
export class NotesListHeaderComponent implements OnInit {
  @Input() public selectedMode = false;
  @Output() public onCancel = new EventEmitter<void>();
  @Output() public onSearch = new EventEmitter<string>();
  @Output() public onChangeView = new EventEmitter<ViewMode>();
  public filterValue = '';
  public isGridView = true;

  ngOnInit(): void {
    this.onChangeView.emit(this.isGridView ? ViewMode.GRID : ViewMode.LIST);
  }

  public changeView(): void {
    this.isGridView = !this.isGridView;
    this.onChangeView.emit(this.isGridView ? ViewMode.GRID : ViewMode.LIST);
  }

  public search(value: string): void {
    this.filterValue = value;
    this.onSearch.emit(value);
  }

  public cancel(): void {
    this.filterValue = '';
    this.onCancel.emit();
  }

}
