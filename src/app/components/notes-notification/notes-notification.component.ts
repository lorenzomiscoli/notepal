import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NoteEvent, NotificationEvent } from './../../interfaces/note.interface';

import { IonToast } from "@ionic/angular/standalone";

import { Subject, takeUntil } from "rxjs";
import { NotesNotificationService } from "../../services/notes-notification-service";
import { NotesService } from "../../services/notes.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-notes-notification",
  templateUrl: "./notes-notification.component.html",
  standalone: true,
  imports: [IonToast]
})
export class NotesNotificationComponent implements OnInit, OnDestroy {
  @ViewChild(IonToast) private toast!: IonToast;
  public isToastOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService,
    private notesNotificationService: NotesNotificationService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.notesNotificationService.toastNotification$
      .pipe(takeUntil(this.destroy$)).subscribe((noteEvent) => {
        this.showToast(noteEvent);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private showToast(noteEvent: NoteEvent): void {
    const multi: boolean = noteEvent.ids.length > 1;
    switch (noteEvent.event) {
      case NotificationEvent.ARCHIVE: {
        this.archiveTemplate(multi, noteEvent.ids);
        break;
      }
      case NotificationEvent.UNARCHIVE: {
        this.unarchiveTemplate(multi, noteEvent.ids);
        break;
      }
      case NotificationEvent.DELETE: {
        this.deleteTemplate(multi, noteEvent.ids);
        break;
      }
      case NotificationEvent.UNDELETE: {
        this.undeleteTemplate(multi, noteEvent.ids);
        break;
      }
    }
    this.isToastOpen = true;
  }

  private archiveTemplate(multi: boolean, ids: number[]): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => {
          this.notesService.archive(ids, false).pipe(takeUntil(this.destroy$)).subscribe();
        }
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesArchived") : this.translateService.instant("noteArchived");
  }

  private unarchiveTemplate(multi: boolean, ids: number[]): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => {
          this.notesService.archive(ids, true).pipe(takeUntil(this.destroy$)).subscribe();
        }
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesRestored") : this.translateService.instant("noteRestored");
  }

  private deleteTemplate(multi: boolean, ids: number[]): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => {
          this.notesService.delete(ids, false).pipe(takeUntil(this.destroy$)).subscribe();
        }
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesToTrash") : this.translateService.instant("noteToTrash");
  }

  private undeleteTemplate(multi: boolean, ids: number[]): void {
    this.toast.buttons = [
      {
        text: this.translateService.instant("undo"),
        role: 'info',
        handler: () => {
          this.notesService.delete(ids, true).pipe(takeUntil(this.destroy$)).subscribe();
        }
      }
    ];
    this.toast.message = multi ? this.translateService.instant("notesRestored") : this.translateService.instant("noteRestored");
  }

}
