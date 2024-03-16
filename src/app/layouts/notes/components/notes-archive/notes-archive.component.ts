import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { NgxMasonryComponent, NgxMasonryOptions } from "ngx-masonry";
import { Subject, Subscription, switchMap, take, takeUntil } from "rxjs";
import { NavController, Platform } from "@ionic/angular/standalone";

import { NOTES_ARCHIVE_DEPS } from "./notes-archive.dependencies";
import { environment } from "../../../../../environments/environment";
import { Note, SortDirection, SortMode, ViewMode } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";
import { NotesSettingService } from "../../services/notes-setting.service";

@Component({
  templateUrl: "./notes-archive.component.html",
  standalone: true,
  styleUrls: ["./notes-archive.component.scss"],
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
  @ViewChild(NgxMasonryComponent) private masonry!: NgxMasonryComponent;
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;

  constructor(private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private platform: Platform,
    private navController: NavController) { }


  ngOnInit(): void {
    this.findNotesSetting();
    this.findArchivedNotes();
    this.notesService.notesUpdated$.pipe(takeUntil(this.destroy$), switchMap(() => {
      return this.notesService.getArchivedNotes();
    })).subscribe(notes => this.notes = notes);
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
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      else {
        this.navController.pop();
      }
    });
  }

  private findNotesSetting(): void {
    this.notesSettingService.getNoteSetting().pipe(take(1)).subscribe(({ viewMode, sortMode, sortDirection }) => {
      this.viewMode = viewMode;
      this.sortMode = sortMode;
      this.sortDirection = sortDirection;
    })
  }

  private findArchivedNotes(): void {
    this.notesService.getArchivedNotes().pipe(take(1)).subscribe((notes) => this.notes = notes);
  }

  public tap(note: Note): void {
    if (this.selectedMode) {
      if (note.isSelected) {
        note.isSelected = false;
      }
      else {
        note.isSelected = true;
      }
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
