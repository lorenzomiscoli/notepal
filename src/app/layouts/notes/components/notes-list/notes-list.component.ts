import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { map, tap } from 'rxjs';

import { NOTES_LIST_DEPS } from "./notes-list.dependencies";
import { Note } from '../../interfaces/note.interface';
import { NotesService } from "../../services/notes.service";

@Component({
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_DEPS]
})
export class NotesListComponent implements OnInit {
  public notes: Note[] = [];
  public searchValue = '';

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.notesService.notesUpdated$.subscribe(() => this.getAllNotes())
  }

  private getAllNotes(): void {
    this.notesService.getAllNotes().pipe(tap(value => this.notes = value), map((value => this.sortByDate(value))))
      .subscribe(value => this.notes = value);
  }

  private sortByDate(notes: Note[]): Note[] {
    if (!notes) return notes;
    return notes.sort((a: Note, b: Note) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
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

  public onSearch(filterValue: string): void {
    this.searchValue = filterValue;
  }

  public onCancel(): void {
    this.notes.forEach(note => note.isSelected = false);
  }

}
