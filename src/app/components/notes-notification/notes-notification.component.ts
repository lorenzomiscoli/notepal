import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NoteEvent, NotificationEvent } from './../../interfaces/note.interface';

import { IonToast } from "@ionic/angular/standalone";

import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

import { environment } from "../../../environments/environment";
import { NotesService } from "../../services/notes.service";

@Component({
  selector: "app-notes-notification",
  templateUrl: "./notes-notification.component.html",
  standalone: true,
  imports: [IonToast]
})
export class NotesNotificationComponent implements OnInit, OnDestroy {
  @ViewChild(IonToast) private toast!: IonToast;
  public isToastOpen = false;
  public toastDuration = environment.toastDuration;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.notesService.toastNotification$.pipe(takeUntil(this.destroy$)).subscribe((noteEvent) => {
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
      case NotificationEvent.ANY: {
        this.anyTemplate(noteEvent.message);
        break;
      }
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

  private anyTemplate(message: string | undefined): void {
    this.toast.message = message;
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
