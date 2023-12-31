import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Platform } from "@ionic/angular";
import { Subject, switchMap, takeUntil } from "rxjs";

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
export class NotesListComponent implements OnInit, OnDestroy {
  public notes: Note[] = [];
  public viewMode: ViewMode = environment.viewMode;
  public sortMode: SortMode = environment.sortMode;
  public selectedMode = false;
  private categoryId: number | undefined;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingService: NotesSettingService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform) { }

  ngOnInit(): void {
    this.getNotes();
    this.getNotesSettings();
    this.getNotesCategories();
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getNotes(): void {
    this.notesService.notesUpdated$.pipe(takeUntil(this.destroy$),
      switchMap(() => {
        if (this.categoryId) {
          return this.notesService.getNotesByCategoryId(this.categoryId!);
        } else {
          return this.notesService.getAllNotes();
        }
      })).subscribe((value) => {
        this.notes = value;
      })
  }

  private getNotesSettings(): void {
    this.notesSettingService.getNoteSetting().pipe(takeUntil(this.destroy$)).subscribe(({ viewMode, sortMode }) => {
      this.viewMode = viewMode;
      this.sortMode = sortMode;
    })
  }

  private getNotesCategories(): void {
    this.notesCategoryService.selectedCategory$.subscribe((categoryId) => {
      this.categoryId = categoryId
      this.notesService.notesUpdated$.next();
    });
  }

  private handleBackButton(): void {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      processNextHandler();
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
      this.router.navigate(["../save"], { relativeTo: this.route, queryParams: { id: note.id } });
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
