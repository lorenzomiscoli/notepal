import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { AlertButton, ToastButton } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

import { Note } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";
import { NOTES_TRASH_SELECTED_HEADER_DEPS } from "./notes-trash-selected-header.dependencies";

@Component({
  selector: "app-notes-trash-selected-header",
  templateUrl: "./notes-trash-selected-header.component.html",
  styleUrls: ["./notes-trash-selected-header.component.scss"],
  standalone: true,
  imports: [NOTES_TRASH_SELECTED_HEADER_DEPS]
})
export class NotesTrashSelectedHeaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public notes!: Note[];
  @Output() public close = new EventEmitter<void>();
  public isDeleteToastOpen = false;
  public isDeleteAlertOpen = false;
  public deleteToastBtns!: ToastButton[];
  public deleteAlertBtns!: AlertButton[];
  private lastDeletedIds: number[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createDeleteToastBtns();
    this.createDeleteAlertBtns();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public checkSelection(): void {
    const selectedNotes = this.getSelectedNotes().length;
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

  private delete(): void {
    this.notesService.delete(this.lastDeletedIds, true).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.lastDeletedIds = [];
    });
  }

  public undelete(): void {
    let ids = this.getSelectedNotes().map(note => note.id);
    this.notesService.delete(ids, false).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isDeleteToastOpen = true;
      this.lastDeletedIds = ids;
    });
  }

  private deleteForever(): void {
    let ids = this.getSelectedNotes().map(note => note.id);
    this.notesService.deleteForever(ids).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public getDeleteToastMsg(): string {
    return this.getSelectedNotes().length > 0 ? this.translateService.instant("notesRestored") : this.translateService.instant("noteRestored");
  }

  public getDeleteAlertMsg(): string {
    const selectedNotesLength = this.getSelectedNotes().length;
    if (selectedNotesLength === 1) {
      return this.translateService.instant("deleteNoteForever");
    } else {
      return this.translateService.instant("deleteNotesForever");
    }
  }

  private createDeleteToastBtns(): void {
    this.deleteToastBtns = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.delete()
      }
    ]
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
