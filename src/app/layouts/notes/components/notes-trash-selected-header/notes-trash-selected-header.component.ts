import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { AlertButton } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

import { Note, NotificationEvent } from "../../../../interfaces/note.interface";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_TRASH_SELECTED_HEADER_DEPS } from "./notes-trash-selected-header.dependencies";

@Component({
  selector: "app-notes-trash-selected-header",
  templateUrl: "./notes-trash-selected-header.component.html",
  standalone: true,
  imports: [NOTES_TRASH_SELECTED_HEADER_DEPS]
})
export class NotesTrashSelectedHeaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Output() public close = new EventEmitter<void>();
  public isDeleteAlertOpen = false;
  public deleteAlertBtns!: AlertButton[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createDeleteAlertBtns();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getSelectedNotes(): Note[] {
    return this.notes.filter(note => note.isSelected);
  }

  public cancel(): void {
    this.close.next();
  }

  public undelete(): void {
    const ids = this.getSelectedNotes().map(note => note.id);
    this.notesService.delete(ids, false).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notesService.toastNotification$.next({ ids: ids, event: NotificationEvent.UNDELETE });
    });
  }

  private deleteForever(): void {
    const ids = this.getSelectedNotes().map(note => note.id);
    this.notesService.deleteForever(ids).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public getDeleteAlertMsg(): string {
    const selectedNotesLength = this.getSelectedNotes().length;
    if (selectedNotesLength === 1) {
      return this.translateService.instant("deleteNoteForever");
    } else {
      return this.translateService.instant("deleteNotesForever");
    }
  }

  private createDeleteAlertBtns(): void {
    this.deleteAlertBtns = [
      {
        text: this.translateService.instant("cancel"),
        role: 'cancel',
      },
      {
        cssClass: "cancel-btn",
        text: this.translateService.instant("delete"),
        role: 'confirm',
        handler: () => this.deleteForever()
      },
    ];
  }

}
