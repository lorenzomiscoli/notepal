import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { IonDatetime, Platform, ViewDidEnter, ViewWillEnter, ViewWillLeave } from "@ionic/angular/standalone";
import { NgxMasonryComponent, NgxMasonryOptions } from "ngx-masonry";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject, Subscription, switchMap, take, takeUntil, tap } from "rxjs";

import { NOTES_CALENDAR_DEPS } from "./notes-calendar.dependencies";
import { Note, SortDirection, SortMode, ViewMode } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";
import { NotesSettingService } from "../../services/notes-setting.service";
import { dateToIsoString, datetimeToDateString } from "../../../../../app/utils/date-utils";
import { environment } from "../../../../../environments/environment";

@Component({
  templateUrl: "./notes-calendar.component.html",
  styleUrls: ["./notes-calendar.component.scss"],
  standalone: true,
  imports: [NOTES_CALENDAR_DEPS]
})
export class NotesCalendarComponent implements OnInit, ViewWillEnter, ViewWillLeave, ViewDidEnter {
  public notes!: Note[];
  public highlightedDates: { date: string, textColor: string, backgroundColor: string }[] = [];
  @ViewChild(IonDatetime) calendar!: IonDatetime;
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public sortDirection: SortDirection = environment.sortDirection;
  public isEmpty = false;
  public selectedDate!: string;
  public locale!: string;
  @ViewChild(NgxMasonryComponent) private masonry!: NgxMasonryComponent;
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingsService: NotesSettingService,
    private translateService: TranslateService,
    private router: Router,
    private platform: Platform) { }

  ngOnInit(): void {
    this.getNotesCreationDates().pipe(take(1)).subscribe();
    this.locale = this.translateService.currentLang;
  }

  ionViewDidEnter(): void {
    if (this.selectedDate) {
      this.showNotes(this.selectedDate)
    } else {
      let today = dateToIsoString(new Date());
      this.calendar.value = today;
      this.showNotes(today)
    }
  }

  ionViewWillEnter(): void {
    this.destroy$ = new Subject<boolean>();
    this.getNotesSettings();
    this.getDatesOnNoteUpdate();
    this.handleBackButton();
  }

  ionViewWillLeave(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.router.navigate(["/notes/list"]);
    });
  }

  public getNotesSettings(): void {
    this.notesSettingsService.getNoteSetting()
      .pipe(takeUntil(this.destroy$)).subscribe(({ viewMode, sortMode, sortDirection }) => {
        this.viewMode = viewMode;
        this.sortMode = sortMode;
        this.sortDirection = sortDirection;
        this.masonry.layout();
      });
  }

  private getDatesOnNoteUpdate(): void {
    this.notesService.notesUpdated$.pipe(takeUntil(this.destroy$),
      switchMap(() => this.getNotesCreationDates()), switchMap(() => this.getNotesByCreationDate())).subscribe();
  }

  private setHighlightedDates(notesDates: { creationDate: string }[]): void {
    this.highlightedDates = [];
    notesDates.forEach(noteDate => {
      this.highlightedDates.push({ date: datetimeToDateString(noteDate.creationDate), textColor: "#800080", backgroundColor: '#ffc0cb' });
    });
  }

  public showNotes(event: CustomEvent | string): void {
    this.selectedDate = event instanceof CustomEvent ? event.detail.value : event;
    this.selectedDate = datetimeToDateString(this.selectedDate);
    this.getNotesByCreationDate().pipe(takeUntil(this.destroy$)).subscribe();
  }

  private getNotesCreationDates(): Observable<{ creationDate: string }[]> {
    return this.notesService.getNotesCreationDates().pipe(tap(notesDates => this.setHighlightedDates(notesDates)));
  }

  private getNotesByCreationDate(): Observable<Note[]> {
    return this.notesService.getNotesByCreationDate(this.selectedDate).pipe(tap((notes) => {
      this.notes = notes
      this.isEmpty = notes.length < 1;
    }));
  }

}
