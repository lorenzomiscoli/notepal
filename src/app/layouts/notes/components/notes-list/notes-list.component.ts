import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { App } from "@capacitor/app";
import { Subject, Subscription, merge, switchMap, take, takeUntil } from "rxjs";

import { NOTES_LIST_DEPS } from "./notes-list.dependencies";
import { Note, SortMode, ViewMode } from '../../interfaces/note.interface';
import { NotesCategoryService } from './../../services/notes-category.service';
import { NotesService } from "../../services/notes.service";
import { NotesSettingService } from "../../services/notes-setting.service";
import { environment } from './../../../../../environments/environment';


@Component({
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_DEPS]
})
export class NotesListComponent implements OnInit, ViewWillEnter, ViewWillLeave {
  public notes: Note[] = [];
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public selectedMode = false;
  private categoryId: number | undefined;
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private platform: Platform) { }

  ngOnInit(): void {
    this.getNotesSettings();
  }

  ionViewWillEnter(): void {
    this.destroy$ = new Subject<boolean>();
    this.getNotes();
    this.handleBackButton();
  }

  ionViewWillLeave(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
    this.deselectAll();
  }

  private getNotesSettings(): void {
    this.notesSettingService.getNoteSetting().pipe(take(1)).subscribe(({ viewMode, sortMode }) => {
      this.viewMode = viewMode;
      this.sortMode = sortMode;
    })
  }

  private getNotes(): void {
    merge(this.notesCategoryService.selectedCategory$, this.notesService.notesUpdated$)
      .pipe(takeUntil(this.destroy$), switchMap((categoryId) => {
        this.categoryId = categoryId as number | undefined;
        if (this.categoryId) {
          return this.notesService.getNotesByCategoryId(this.categoryId);
        } else {
          return this.notesService.getAllNotes();
        }
      })).subscribe(notes => this.notes = notes);
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      else {
        App.exitApp();
      }
    });
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
    this.notes.forEach(note => note.isSelected = false);
  }

}
