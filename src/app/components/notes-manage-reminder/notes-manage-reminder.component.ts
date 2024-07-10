import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

import { Note, NoteReminder, ScheduleEvery } from '../../interfaces/note.interface';
import { NotesReminderService } from "../../services/notes-reminder.service";
import { dateToIsoString } from "../../utils/date-utils";
import { NOTES_MANAGE_REMINDER_DEPS } from "./notes-manage-reminder.dependencies";

@Component({
  selector: "app-notes-manage-reminder",
  templateUrl: "./notes-manage-reminder.component.html",
  styleUrl: "./notes-manage-reminder.component.scss",
  standalone: true,
  imports: [NOTES_MANAGE_REMINDER_DEPS]
})
export class NotesManageReminderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public note!: Note;
  @Input() public isOpen = false;
  @Output() public dismiss = new EventEmitter<void>();
  @ViewChild('modal') modal!: IonModal;
  public reminder!: NoteReminder | undefined;
  public locale!: string;
  public firstDayOfWeek = 0;
  public selectedDate!: string;
  public selectedRepeat = ScheduleEvery.NO_SCHEDULE;
  public selectedRepeatType: typeof ScheduleEvery = ScheduleEvery;
  public repeatTranslation!: string;
  public isEdit = false;
  public invalidDate = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesReminderService: NotesReminderService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.repeatTranslation = this.translateService.instant("repeat");
    this.locale = this.translateService.currentLang;
    this.firstDayOfWeek = this.translateService.currentLang === 'en' ? 0 : 1;
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
          this.selectedRepeat = reminder.every;
        } else {
          this.selectedDate = dateToIsoString(new Date());
        }
      })
    }
  }

  public onModalDismiss(): void {
    this.isEdit = false;
    this.invalidDate = false;
    this.dismiss.next();
  }

  public getModalTitle(): string {
    return this.isEdit ? 'editReminder' : 'addReminder';
  }

  public save(): void {
    if (!this.isDateValid(new Date(this.selectedDate).toISOString())) {
      this.invalidDate = true;
      return;
    }
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

  private isDateValid(selectedDate: string): boolean {
    return selectedDate <= new Date().toISOString() ? false : true;
  }

  public isDateGreaterThanToday = (dateString: string) => {
    const today = dateToIsoString(new Date()).split('T')[0];
    return today <= dateString;
  };

}
