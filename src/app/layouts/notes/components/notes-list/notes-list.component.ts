import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Platform } from "@ionic/angular";

import { NOTES_LIST_DEPS } from "./notes-list.dependencies";
import { Note, SortMode, ViewMode } from '../../interfaces/note.interface';
import { NotesService } from "../../services/notes.service";

@Component({
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_DEPS]
})
export class NotesListComponent implements OnInit {
  public notes: Note[] = [];
  public viewMode: ViewMode = ViewMode.GRID;
  public sortMode: SortMode = SortMode.MODIFIED_DATE;
  public selectedMode = false;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute, private platform: Platform) { }

  ngOnInit(): void {
    this.notesService.notesUpdated$.subscribe(() => this.getAllNotes())
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      processNextHandler();
    });
  }

  private getAllNotes(): void {
    this.notesService.getAllNotes().subscribe(value => this.notes = value);
  }

  public tap(note: Note): void {
    if (this.selectedMode) {
      if (note.isSelected) {
        note.isSelected = false;
      }
      else {
        note.isSelected = true;
      }
    } else {
      this.router.navigate(["../save"], { relativeTo: this.route, queryParams: { id: note.id } });
    }
  }

  public press(note: Note): void {
    if (this.selectedMode) {
      if (note.isSelected) {
        note.isSelected = false;
      } else {
        note.isSelected = true;
      }
    } else {
      note.isSelected = true;
      this.selectedMode = true;
    }
  }

  public deselectAll(): void {
    this.selectedMode = false;
    this.notes.forEach(note => note.isSelected = false);
  }

  public onViewChange(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  public onSortChange(sortMode: SortMode): void {
    this.sortMode = sortMode;
  }

}
