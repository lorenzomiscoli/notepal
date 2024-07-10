import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { Subject, takeUntil } from 'rxjs';

import { Note } from "../../interfaces/note.interface";
import { NotesService } from './../../services/notes.service';
import { NOTES_SELECTED_HEADER_DEPS } from "./notes-selected-header.dependencies";

@Component({
  selector: "app-notes-selected-header",
  templateUrl: "./notes-selected-header.component.html",
  standalone: true,
  imports: [NOTES_SELECTED_HEADER_DEPS]
})
export class NotesSelectedHeaderComponent implements OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Input() public isCustomLayout = false;
  @Output() public dismiss = new EventEmitter<void>();
  public isColorPickerOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getSelectedNotes(): Note[] {
    return this.notes.filter(note => note.isSelected === true);
  }

  public getSelectedPinnedNotesLength(): number {
    return this.notes.filter(note => note.pinned === 1 && note.isSelected).length;
  }

  public isSelected(): boolean {
    return this.notes.find(note => note.isSelected === true) ? true : false;
  }

  public cancel(): void {
    this.dismiss.emit();
  }

  public isEachNotePinned(): boolean {
    if (this.getSelectedNotes().length === 0) {
      return false;
    }
    else if (this.getSelectedPinnedNotesLength() === this.getSelectedNotes().length) {
      return true;
    } else {
      return false;
    }
  }

  public checkSelection(): void {
    const selectedNotes = this.notes.filter(note => note.isSelected === true).length;
    if (selectedNotes === this.notes.length) {
      this.notes.forEach(note => note.isSelected = false);
    } else {
      this.notes.forEach(note => note.isSelected = true);
    }
  }

  public checkPinned(): void {
    const ids: number[] = this.getSelectedNotes().map(note => note.id);
    if (this.getSelectedPinnedNotesLength() === this.getSelectedNotes().length) {
      this.notesService.pin(ids, false).pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.notesService.pin(ids, true).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

}
