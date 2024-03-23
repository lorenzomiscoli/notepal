import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NotesService } from './../../services/notes.service';

import { Subject, takeUntil } from "rxjs";
import { Note } from "../../interfaces/note.interface";
import { NOTES_MENU_DEPS } from "./notes-menu.dependencies";
import { TranslateService } from "@ngx-translate/core";
import { ToastButton } from "@ionic/angular/standalone";

@Component({
  selector: "app-notes-menu",
  templateUrl: "./notes-menu.component.html",
  styleUrls: ["./notes-menu.component.scss"],
  standalone: true,
  imports: [NOTES_MENU_DEPS]
})
export class NotesMenuComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public selectedNotes!: Note[];
  public lastArchivedIds: number[] = [];
  public lastDeletedIds: number[] = [];
  public isArchiveToastOpen = false;
  public isDeleteToastOpen = false;
  public isMoveModalOpen = false;
  public archiveToastButtons!: ToastButton[];
  public deleteToastButtons!: ToastButton[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createArchiveButtons();
    this.createDeleteButtons();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private createArchiveButtons(): void {
    this.archiveToastButtons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.unarchive()
      }
    ];
  }

  private createDeleteButtons(): void {
    this.deleteToastButtons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.undelete()
      }
    ];
  }

  public getArchiveMessage(): string {
    return this.lastArchivedIds.length > 1 ? this.translateService.instant("notesArchived") : this.translateService.instant("noteArchived");
  }

  public getDeleteMessage(): string {
    return this.lastDeletedIds.length > 1 ? this.translateService.instant("notesToTrash") : this.translateService.instant("noteToTrash");
  }

  public archive(): void {
    const ids = this.selectedNotes.map(note => note.id);
    this.notesService.archiveNotes(ids)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.isArchiveToastOpen = true;
        this.lastArchivedIds = ids;
      });
  }

  public delete(): void {
    const ids = this.selectedNotes.map(note => note.id);
    this.notesService.delete(ids, true).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isDeleteToastOpen = true;
      this.lastDeletedIds = ids;
    })
  }

  private undelete(): void {
    this.notesService.delete(this.lastDeletedIds, false).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.lastDeletedIds = [];
    })
  }

  private unarchive(): void {
    this.notesService.unarchiveNotes(this.lastArchivedIds)
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.lastArchivedIds = []);
  }

}
