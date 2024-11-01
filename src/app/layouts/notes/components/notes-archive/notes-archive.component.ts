import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NavController, Platform } from "@ionic/angular/standalone";
import { NgxMasonryOptions } from "ngx-masonry";
import { Subject, Subscription, switchMap, take, takeUntil } from "rxjs";

import { environment } from "../../../../../environments/environment";
import { Note, SortDirection, SortMode, ViewMode } from "../../../../interfaces/note.interface";
import { NotesSettingService } from "../../../../services/notes-setting.service";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_ARCHIVE_DEPS } from "./notes-archive.dependencies";

@Component({
  templateUrl: "./notes-archive.component.html",
  standalone: true,
  styles: [`:host {  background-color: var(--ion-color-light);  }`],
  imports: [NOTES_ARCHIVE_DEPS]
})
export class NotesArchiveComponent implements OnInit, OnDestroy {
  public notes: Note[] = [];
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public sortDirection: SortDirection = environment.sortDirection;
  public selectedMode = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;

  constructor(private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private platform: Platform,
    private navController: NavController,
    private router: Router) { }


  ngOnInit(): void {
    this.findSettings();
    this.findArchived();
    this.notesService.notesUpdated$.pipe(switchMap(() => {
      return this.notesService.findArchived();
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

  private findSettings(): void {
    this.notesSettingService.findFirst().pipe(take(1)).subscribe(({ viewMode, sortMode, sortDirection }) => {
      this.viewMode = viewMode;
      this.sortMode = sortMode;
      this.sortDirection = sortDirection;
    })
  }

  private findArchived(): void {
    this.notesService.findArchived().pipe(take(1)).subscribe((notes) => this.notes = notes);
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

  public deselectAll(): void {
    this.selectedMode = false;
    this.notes.forEach(notes => notes.isSelected = false);
  }

}
