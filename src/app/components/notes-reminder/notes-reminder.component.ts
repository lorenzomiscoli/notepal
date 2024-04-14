import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";

import { LocalNotifications, ScheduleResult } from "@capacitor/local-notifications";
import { IonModal } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject, from, of, switchMap, takeUntil } from "rxjs";

import { NotesReminderService } from "../../services/notes-reminder.service";
import { dateToIsoString } from "../../utils/date-utils";
import { Note, NoteReminder, ScheduleEvery } from './../../interfaces/note.interface';
import { NOTES_REMINDER_DEPS } from "./notes-reminder.dependencies";

@Component({
  selector: "app-notes-reminder",
  templateUrl: "./notes-reminder.component.html",
  styleUrls: ["./notes-reminder.component.scss"],
  standalone: true,
  imports: [NOTES_REMINDER_DEPS]
})
export class NotesReminder implements OnInit, OnDestroy {
  @Input({ required: true }) public note!: Note;
  @Input() public isOpen = false;
  @Output() public close = new EventEmitter<void>();
  @ViewChild('modal') modal!: IonModal;
  public reminder!: NoteReminder | undefined;
  public locale!: string;
  public selectedDate!: string;
  public selectedRepeat = ScheduleEvery.NO_SCHEDULE;
  public selectedRepeatType: typeof ScheduleEvery = ScheduleEvery;
  public repeatTranslation!: string;
  public isEdit = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesReminderService: NotesReminderService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.repeatTranslation = this.translateService.instant("repeat");
    this.locale = this.translateService.currentLang;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public retriveData(): void {
    if (this.note && this.note.id) {
      this.notesReminderService.findByNoteId(this.note.id).pipe(takeUntil(this.destroy$)).subscribe((reminder) => {
        this.reminder = reminder;
        if (reminder) {
          this.isEdit = true;
          this.selectedDate = dateToIsoString(new Date(reminder.date));
        } else {
          this.selectedDate = dateToIsoString(new Date());
        }
      })
    }
  }

  public onModalDismiss(): void {
    this.isEdit = false;
    this.close.next();
  }

  public getModalTitle(): string {
    return this.isEdit ? 'editReminder' : 'addReminder';
  }

  public save(): void {
    const reminder = {
      date: new Date(this.selectedDate).toISOString(),
      repeat: this.selectedRepeat === ScheduleEvery.NO_SCHEDULE ? 0 : 1,
      every: this.selectedRepeat,
      noteId: this.note.id
    };
    if (this.reminder) {
      this.reminder = { id: this.reminder.id, ...reminder };
      this.notesReminderService.update(this.reminder).pipe(takeUntil(this.destroy$)).subscribe(() => { this.modal.dismiss() });
    } else {
      this.notesReminderService.insert(reminder).pipe(takeUntil(this.destroy$)).subscribe(() => this.modal.dismiss());
    }
  }

  public delete(): void {
    this.notesReminderService.delete(this.reminder!.id, this.note.id)
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.modal.dismiss());
  }

}
