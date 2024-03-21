import { Component, OnDestroy, OnInit } from "@angular/core";

import { NavController, Platform } from "@ionic/angular/standalone";
import { NgxMasonryOptions } from "ngx-masonry";
import { Subject, Subscription, switchMap, take, takeUntil } from "rxjs";

import { environment } from "../../../../../environments/environment";
import { Note, SortDirection, SortMode, ViewMode } from "../../interfaces/note.interface";
import { NotesSettingService } from "../../services/notes-setting.service";
import { NotesService } from "../../services/notes.service";
import { NOTES_TRASH_DEPS } from "./notes-trash.dependencies";

@Component({
  templateUrl: "./notes-trash.component.html",
  styles: [`:host {  background-color: var(--ion-color-light);  }`],
  standalone: true,
  imports: [NOTES_TRASH_DEPS]
})
export class NotesTrashComponent implements OnInit, OnDestroy {
  public notes: Note[] = [];
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public sortDirection: SortDirection = environment.sortDirection;
  public selectedMode = false;
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private platform: Platform,
    private navController: NavController) { }


  ngOnInit(): void {
    this.findNotesSetting();
    this.findDeletedNotes();
    this.notesService.notesUpdated$.pipe(takeUntil(this.destroy$), switchMap(() => {
      return this.notesService.getDeletedNotes();
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

  private findDeletedNotes(): void {
    this.notesService.getDeletedNotes().pipe(take(1)).subscribe((notes) => this.notes = notes);
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
