import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { NOTES_LIST_DEPS } from "./notes-list.dependencies";
import { Note, SortMode, ViewMode } from '../../interfaces/note.interface';
import { NotesService } from "../../services/notes.service";
import { Platform } from "@ionic/angular";

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

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute, private platform: Platform) { }

  ngOnInit(): void {
    this.notesService.notesUpdated$.subscribe(() => this.getAllNotes())
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.isSelectedMode()) {
        this.deselectAll();
      }
      processNextHandler();
    });
  }

  private getAllNotes(): void {
    this.notesService.getAllNotes().subscribe(value => this.notes = value);
  }

  public tap(note: Note): void {
    if (this.isSelectedMode()) {
      if (note.isSelected) {
        note.isSelected = false;
      }
      else {
        note.isSelected = true;
      }
    } else {
      this.router.navigate(["save"], { relativeTo: this.route, queryParams: { id: note.id } });
    }
  }

  public press(note: Note): void {
    if (this.isSelectedMode()) {
      if (note.isSelected) {
        note.isSelected = false;
      } else {
        note.isSelected = true;
      }
    } else {
      note.isSelected = true;
    }
  }

  public isSelectedMode(): boolean {
    return this.notes.find(note => note.isSelected) ? true : false;
  }

  public deselectAll(): void {
    this.notes.forEach(note => note.isSelected = false);
  }

  public selectedNotes(): Note[] {
    var selectedNotes = this.notes.filter(note => note.isSelected === true);
    return selectedNotes;
  }

  public onViewChange(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  public onSortChange(sortMode: SortMode): void {
    this.sortMode = sortMode;
  }

}
