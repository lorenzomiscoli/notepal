import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { IonDatetime, Platform, ViewDidEnter, ViewWillEnter, ViewWillLeave } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { NgxMasonryComponent, NgxMasonryOptions } from "ngx-masonry";
import { Observable, Subject, Subscription, switchMap, take, takeUntil, tap } from "rxjs";

import { dateToIsoString, datetimeToDateString } from "../../../../../app/utils/date-utils";
import { environment } from "../../../../../environments/environment";
import { Note, SortDirection, SortMode, ViewMode } from "../../../../interfaces/note.interface";
import { NotesSettingService } from "../../../../services/notes-setting.service";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_CALENDAR_DEPS } from "./notes-calendar.dependencies";

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
  public firstDayOfWeek = 1;
  public isInsertBtnEnabled = true;
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
    this.findCreationDates().pipe(take(1)).subscribe();
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.locale = value.lang;
      this.firstDayOfWeek = value.lang === 'en' ? 0 : 1;
    });
    this.locale = this.translateService.currentLang;
    this.firstDayOfWeek = this.translateService.currentLang === 'en' ? 0 : 1;
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
    this.findSettings();
    this.findCreationDatesOnNotesUpdate();
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

  public findSettings(): void {
    this.notesSettingsService.findFirst()
      .pipe(takeUntil(this.destroy$)).subscribe(({ viewMode, sortMode, sortDirection }) => {
        this.viewMode = viewMode;
        this.sortMode = sortMode;
        this.sortDirection = sortDirection;
        this.masonry.layout();
      });
  }

  private findCreationDatesOnNotesUpdate(): void {
    this.notesService.notesUpdated$.pipe(takeUntil(this.destroy$),
      switchMap(() => this.findCreationDates()), switchMap(() => this.findByCreationDate())).subscribe();
  }

  private setHighlightedDates(notesDates: { creationDate: string }[]): void {
    this.highlightedDates = [];
    notesDates.forEach(noteDate => {
      this.highlightedDates.push({ date: datetimeToDateString(noteDate.creationDate), textColor: "#ffff", backgroundColor: '#9B6D78' });
    });
  }

  public showNotes(event: CustomEvent | string): void {
    this.selectedDate = event instanceof CustomEvent ? event.detail.value : event;
    this.selectedDate = datetimeToDateString(this.selectedDate);
    this.isInsertBtnEnabled = this.isDateGreaterThanToday(this.selectedDate);
    this.findByCreationDate().pipe(takeUntil(this.destroy$)).subscribe();
  }

  private findCreationDates(): Observable<{ creationDate: string }[]> {
    return this.notesService.findCreationDates().pipe(tap(notesDates => this.setHighlightedDates(notesDates)));
  }

  private findByCreationDate(): Observable<Note[]> {
    return this.notesService.findByCreationDate(this.selectedDate).pipe(tap((notes) => {
      this.notes = notes
      this.isEmpty = notes.length < 1;
    }));
  }

  public isDateGreaterThanToday = (dateString: string) => {
    const today = dateToIsoString(new Date()).split('T')[0];
    return today <= dateString;
  };

  public tap(note: Note): void {
    this.router.navigate(["/notes/save"], { queryParams: { id: note.id } });
  }

}
