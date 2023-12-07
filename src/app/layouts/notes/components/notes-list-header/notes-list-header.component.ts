import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";

import { NOTES_LIST_HEADER_DEPS } from "./notes-list-header.dependencies";
import { SortMode, ViewMode } from "../../interfaces/note.interface";

@Component({
  selector: "app-notes-list-header",
  templateUrl: "./notes-list-header.component.html",
  styleUrls: ["./notes-list-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_HEADER_DEPS]
})
export class NotesListHeaderComponent implements OnInit {
  @Output() public onSearch = new EventEmitter<string>();
  @Output() public viewChange = new EventEmitter<ViewMode>();
  @Output() public sortChange = new EventEmitter<SortMode>();
  public filterValue = '';
  public isGridView = true;
  public sortMode = SortMode.MODIFIED_DATE;
  public isSortModalOpen = false;
  @ViewChild(IonModal) sortModal!: IonModal;

  ngOnInit(): void {
    this.viewChange.emit(this.isGridView ? ViewMode.GRID : ViewMode.LIST);
  }

  public changeView(): void {
    this.isGridView = !this.isGridView;
    this.viewChange.emit(this.isGridView ? ViewMode.GRID : ViewMode.LIST);
  }

  public search(value: string): void {
    this.filterValue = value;
    this.onSearch.emit(value);
  }

  public changeSort(event: CustomEvent): void {
    this.sortMode = event.detail.value;
    this.sortChange.emit(this.sortMode);
    this.sortModal.dismiss();
  }

  public openSortModal(isOpen: boolean): void {
    this.isSortModalOpen = isOpen;
  }

}
