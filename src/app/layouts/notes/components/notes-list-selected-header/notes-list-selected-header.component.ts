import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { Note } from "../../../../interfaces/note.interface";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_LIST_SELECTED_HEADER_DEPS } from "./notes-list-selected-header.dependencies";

@Component({
  selector: "app-notes-list-selected-header",
  templateUrl: "./notes-list-selected-header.component.html",
  standalone: true,
  imports: [NOTES_LIST_SELECTED_HEADER_DEPS]
})
export class NotesListSelectedHeaderComponent implements OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Output() public close = new EventEmitter<void>();
  public isMenuOpen = false;
  public isColorPickerOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public cancel(): void {
    this.close.emit();
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

  public checkSelection(): void {
    const selectedNotes = this.notes.filter(note => note.isSelected === true).length;
    if (selectedNotes === this.notes.length) {
      this.notes.forEach(note => note.isSelected = false);
    } else {
      this.notes.forEach(note => note.isSelected = true);
    }
  }

  public checkPinned(): void {
    let ids: number[] = this.getSelectedNotes().map(note => note.id);
    if (this.getSelectedPinnedNotesLength() === this.getSelectedNotes().length) {
      this.notesService.unpinNotes(ids).pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.notesService.pinNotes(ids).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }



}
