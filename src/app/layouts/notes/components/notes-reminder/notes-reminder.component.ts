import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NavController, Platform } from "@ionic/angular/standalone";
import { NgxMasonryOptions } from "ngx-masonry";
import { Subject, Subscription, switchMap, take, takeUntil } from "rxjs";

import { Note, SortDirection, SortMode, ViewMode } from "../../../../../app/interfaces/note.interface";
import { NotesSettingService } from "../../../../../app/services/notes-setting.service";
import { NotesService } from "../../../../../app/services/notes.service";
import { environment } from "../../../../../environments/environment";
import { NOTES_REMINDER_DEPS } from "./notes-reminder.dependencies";

@Component({
  templateUrl: "./notes-reminder.component.html",
  styles: [`:host {  background-color: var(--ion-color-light);  }`],
  standalone: true,
  imports: [NOTES_REMINDER_DEPS]
})
export class NotesReminderComponent implements OnInit, OnDestroy {
  public notes: Note[] = [];
  public selectedMode = false;
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public sortDirection: SortDirection = environment.sortDirection;
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;

  constructor(private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private platform: Platform,
    private navController: NavController,
    private router: Router) { }

  ngOnInit(): void {
    this.findSettings();
    this.findReminders();
    this.notesService.notesUpdated$.pipe(switchMap(() => {
      return this.notesService.findReminders();
    }), takeUntil(this.destroy$)).subscribe(notes => this.notes = notes);
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      else {
        this.navController.pop();
      }
    });
  }

  private findReminders(): void {
    this.notesService.findReminders().pipe(take(1)).subscribe((notes) => this.notes = notes);
  }

  private findSettings(): void {
    this.notesSettingService.findFirst().pipe(take(1)).subscribe(({ viewMode, sortMode, sortDirection }) => {
      this.viewMode = viewMode;
      this.sortMode = sortMode;
      this.sortDirection = sortDirection;
    })
  }

  public deselectAll(): void {
    this.selectedMode = false;
    this.notes.forEach(notes => notes.isSelected = false);
  }

  public tap(note: Note): void {
    if (this.selectedMode) {
      if (note.isSelected) {
        note.isSelected = false;
      }
      else {
        note.isSelected = true;
      }
    } else {
      this.router.navigate(["/notes/save"], { queryParams: { id: note.id } });
    }
  }

  public press(note: Note): void {
    if (this.selectedMode) {
      if (note.isSelected) {
        note.isSelected = false;
      } else {
        note.isSelected = true;
      }
    } else {
      note.isSelected = true;
      this.selectedMode = true;
    }
  }

}
