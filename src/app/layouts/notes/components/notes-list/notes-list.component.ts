import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, map } from 'rxjs';

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
  public notes$!: Observable<Note[] | any>;
  public searchValue = '';

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.notesService.notesUpdated$.subscribe(() => this.getAllNotes())
  }

  private getAllNotes(): void {
    this.notes$ = this.notesService.getAllNotes().pipe(map((value => this.sortByDate(value))));
  }

  private sortByDate(notes: Note[]): Note[] {
    if (!notes) return notes;
    return notes.sort((a: Note, b: Note) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  public tap(id: number): void {
    this.router.navigate(["add"], { relativeTo: this.route, queryParams: { id: id } });
  }

  public press(id: number): void {
    this.notesService.delete([id]).subscribe();
  }

  public onSearch(event: any): void {
    this.searchValue = event.detail.value;
  }

}
