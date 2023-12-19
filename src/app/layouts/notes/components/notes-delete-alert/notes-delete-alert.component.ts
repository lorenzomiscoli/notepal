import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { AlertButton } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { NOTES_DELETE_ALERT_DEPS } from "./notes-delete-alert.dependencies";
import { NotesService } from "../../services/notes.service";
import { Note } from "../../interfaces/note.interface";

@Component({
  selector: "app-notes-delete-alert",
  templateUrl: "./notes-delete-alert.component.html",
  styleUrls: ["./notes-delete-alert.component.scss"],
  standalone: true,
  imports: [NOTES_DELETE_ALERT_DEPS]
})
export class NotesDeleteAlertComponent implements OnInit {
  @Input() public isOpen = false;
  @Input({ required: true }) public notes!: Note[];
  @Output() public close = new EventEmitter<void>();
  public deleteAlertBtns!: AlertButton[];
  private message!: { single: string, multi: string };
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createDeleteAlertBtns();
    this.createMessageTranslations();
  }

  private createDeleteAlertBtns(): void {
    const cancelText = this.translateService.instant("cancel");
    const deleteText = this.translateService.instant("delete");
    this.deleteAlertBtns = [
      {
        text: cancelText,
        role: 'cancel',
      },
      {
        cssClass: "cancel-btn",
        text: deleteText,
        role: 'confirm',
        handler: () => this.delete()
      },
    ];
  }

  private createMessageTranslations(): void {
    this.message = {
      single: this.translateService.instant("deleteThisNote"),
      multi: this.translateService.instant("deleteNotes")
    };
  }

  public getMessage(): string {
    if (this.notes.length === 1) {
      return this.message.single;
    } else {
      return this.message.multi.replace('#', this.notes.length.toString());
    }
  }

  private delete(): void {
    let ids = this.notes.map(note => note.id);
    this.notesService.delete(ids).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
