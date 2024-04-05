import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { Note } from "../../interfaces/note.interface";
import { NotificationEvent } from './../../interfaces/note.interface';
import { NotesService } from './../../services/notes.service';
import { NOTES_MENU_DEPS } from "./notes-menu.dependencies";

@Component({
  selector: "app-notes-menu",
  templateUrl: "./notes-menu.component.html",
  styleUrls: ["./notes-menu.component.scss"],
  standalone: true,
  imports: [NOTES_MENU_DEPS]
})
export class NotesMenuComponent implements OnDestroy {
  @Input({ required: true }) public selectedNotes!: Note[];
  @Output() public archived = new EventEmitter<void>();
  @Output() public deleted = new EventEmitter<void>();
  @Output() public moved = new EventEmitter<number>();
  public isMoveModalOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public archive(): void {
    const ids = this.selectedNotes.map(note => note.id);
    this.notesService.archive(ids, true)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.notesService.toastNotification$.next({ ids: ids, event: NotificationEvent.ARCHIVE });
        this.archived.emit();
      });
  }

  public delete(): void {
    const ids = this.selectedNotes.map(note => note.id);
    this.notesService.delete(ids, true).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notesService.toastNotification$.next({ ids: ids, event: NotificationEvent.DELETE });
      this.deleted.emit();
    })
  }

}
