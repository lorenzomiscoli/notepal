import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";

import { IonToast, ToastButton } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { NOTES_ARCHIVE_SELECTED_HEADER_DEPS } from "./notes-archive-selected-header.dependencies";
import { Note } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";

@Component({
  selector: "app-notes-archive-selected-header",
  templateUrl: "./notes-archive-selected-header.component.html",
  standalone: true,
  imports: [NOTES_ARCHIVE_SELECTED_HEADER_DEPS]
})
export class NotesArchiveSelectedHeaderComponent implements OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Output() public close = new EventEmitter<void>();
  public isToastOpen = false;
  public toastButtons!: ToastButton[];
  @ViewChild(IonToast) private toast!: IonToast;
  private lastArchivedIds: number[] = [];
  private lastDeletedIds: number[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public checkSelection(): void {
    const selectedNotes = this.notes.filter(note => note.isSelected === true).length;
    if (selectedNotes === this.notes.length) {
      this.notes.forEach(note => note.isSelected = false);
    } else {
      this.notes.forEach(note => note.isSelected = true);
    }
  }

  public getSelectedNotes(): Note[] {
    return this.notes.filter(note => note.isSelected);
  }

  public cancel(): void {
    this.close.next();
  }

  public setUnarchiveToast(multi: boolean): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.archiveNotes()
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesRestored") : this.translateService.instant("noteRestored");
  }

  public setUndeleteToast(multi: boolean): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.undeleteNotes()
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesToBin") : this.translateService.instant("noteToBin");
  }

  public unarchiveNotes(): void {
    const ids: number[] = this.getSelectedNotes().map(note => note.id);
    this.setUnarchiveToast(ids.length > 1);
    this.notesService.unarchiveNotes(ids).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isToastOpen = true
      this.lastArchivedIds = ids;
    });
  }

  private archiveNotes(): void {
    this.notesService.archiveNotes(this.lastArchivedIds)
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.lastArchivedIds = []);
  }

  public deleteNotes(): void {
    const ids: number[] = this.getSelectedNotes().map(note => note.id);
    this.setUndeleteToast(ids.length > 1);
    this.notesService.delete(ids, true).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isToastOpen = true
      this.lastDeletedIds = ids;
    });
  }

  private undeleteNotes(): void {
    this.notesService.delete(this.lastDeletedIds, false)
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.lastDeletedIds = []);
  }

}
