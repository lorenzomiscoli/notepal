import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { Note, NotificationEvent } from "../../../../interfaces/note.interface";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_ARCHIVE_SELECTED_HEADER_DEPS } from "./notes-archive-selected-header.dependencies";

@Component({
  selector: "app-notes-archive-selected-header",
  templateUrl: "./notes-archive-selected-header.component.html",
  standalone: true,
  imports: [NOTES_ARCHIVE_SELECTED_HEADER_DEPS]
})
export class NotesArchiveSelectedHeaderComponent implements OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Output() public dismiss = new EventEmitter<void>();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getSelectedNotes(): Note[] {
    return this.notes.filter(note => note.isSelected);
  }

  public cancel(): void {
    this.dismiss.next();
  }

  public unarchive(): void {
    const ids: number[] = this.getSelectedNotes().map(note => note.id);
    this.notesService.archive(ids, false).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notesService.toastNotification$.next({ ids: ids, event: NotificationEvent.UNARCHIVE });
    });
  }

  public delete(): void {
    const ids: number[] = this.getSelectedNotes().map(note => note.id);
    this.notesService.delete(ids, true).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notesService.toastNotification$.next({ ids: ids, event: NotificationEvent.DELETE });
    });
  }

}
