import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";

import { IonToast, ToastButton } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

import { Note } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";
import { NOTES_LIST_SELECTED_HEADER_DEPS } from "./notes-list-selected-header.dependencies";

@Component({
  selector: "app-notes-list-selected-header",
  templateUrl: "./notes-list-selected-header.component.html",
  styleUrls: ["./notes-list-selected-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_SELECTED_HEADER_DEPS]
})
export class NotesListSelectedHeaderComponent implements OnInit, OnDestroy {
  @Output() public close = new EventEmitter<void>();
  @Input({ required: true }) public notes!: Note[];
  public isDeleteAlertOpen = false;
  private archiveMessage!: { single: string, multi: string };
  public isArchiveToastOpen = false;
  @ViewChild("archiveToast") private archiveToast!: IonToast;
  public archiveToastButtons!: ToastButton[];
  private lastArchivedIds!: number[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public isColorPickerOpen = false;
  public isMoveOpen = false;

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createArchiveTranslations();
    this.createArchiveButtons();
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

  public toggleDeleteAlert(isOpen: boolean): void {
    this.isDeleteAlertOpen = isOpen;
  }

  private createArchiveTranslations(): void {
    this.archiveMessage = {
      single: this.translateService.instant("noteArchived"),
      multi: this.translateService.instant("notesArchived"),
    }
  }

  private createArchiveButtons(): void {
    this.archiveToastButtons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => this.unarchiveNotes()
      }
    ];
  }

  public unarchiveNotes(): void {
    this.notesService.unarchiveNotes(this.lastArchivedIds).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.lastArchivedIds = [];
    });
  }

  public archiveNotes(): void {
    let notes = this.getSelectedNotes().map(note => note.id);
    this.archiveToast.message = notes.length > 1 ? this.archiveMessage.multi : this.archiveMessage.single;
    this.notesService.archiveNotes(notes).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isArchiveToastOpen = true;
      this.lastArchivedIds = notes;
    });
  }

  public checkPinned(): void {
    let ids: number[] = this.getSelectedNotes().map(note => note.id);
    if (this.getSelectedPinnedNotesLength() === this.getSelectedNotes().length) {
      this.notesService.unpinNotes(ids).pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.notesService.pinNotes(ids).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
