import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ViewDidEnter, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { NgxMasonryOptions } from "ngx-masonry";
import { Subject, Subscription, debounceTime, switchMap, takeUntil } from "rxjs";

import { NOTES_SEARCH_DEPS } from "./notes-search.dependencies";
import { Note, NoteBackground, NoteCategory, NoteSearchFilter, ViewMode } from "../../interfaces/note.interface";
import { NotesCategoryService } from "../../services/notes-category.service";
import { NotesService } from "../../services/notes.service";
import { NotesSettingService } from "../../services/notes-setting.service";
import { environment } from './../../../../../environments/environment';

@Component({
  templateUrl: "./notes-search.component.html",
  styleUrls: ["./notes-search.component.scss"],
  standalone: true,
  imports: [NOTES_SEARCH_DEPS]
})
export class NotesSearchComponent implements ViewWillEnter, ViewWillLeave, ViewDidEnter {
  @ViewChild("searchInput") public searchInput!: ElementRef;
  public filterValue = '';
  public notes: Note[] = [];
  public categories: NoteCategory[] = [];
  private search$ = new Subject<string>();
  public isSearch = false;
  public viewMode: ViewMode = environment.viewMode;
  public filterMode = false;
  private filter!: { id: number | string | null, type: NoteSearchFilter };
  public backgrounds: string[] = Object.values(NoteBackground);
  public masonryOptions: NgxMasonryOptions = environment.masonryOptions;
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingsService: NotesSettingService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private platform: Platform) {
  }

  ionViewWillEnter(): void {
    this.destroy$ = new Subject<boolean>();
    this.getNotesSettings();
    this.getNotesCategories();
    this.search();
    this.handleBackButton();
  }

  ionViewWillLeave(): void {
    this.cleanup();
  }

  ionViewDidEnter(): void {
    this.searchInput.nativeElement.focus();
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.filterMode) {
        this.resetBackButton();
      } else {
        this.router.navigate(["/notes/list"]);
      }
    });
  }

  public resetBackButton(): void {
    this.filterMode = false;
    this.filterValue = "";
    this.notes = [];
    this.isSearch = false;
  }

  public search(): void {
    this.search$.pipe(takeUntil(this.destroy$), debounceTime(250), switchMap((value) => {
      if (this.filterMode) {
        if (this.filter.type === NoteSearchFilter.CATEGORY) {
          return this.notesService.searchNotesByCategoryId(this.filter.id as number, value);
        }
        else {
          return this.notesService.searchNotesByBackground(this.filter.id as string, value);
        }
      } else {
        return this.notesService.searchNotes(value);
      }
    })).subscribe((value) => {
      this.notes = value;
      this.isSearch = true
    })
  }

  public getNotesSettings(): void {
    this.notesSettingsService.getNoteSetting().pipe(takeUntil(this.destroy$)).subscribe((noteSetting) => {
      this.viewMode = noteSetting.viewMode;
    });
  }

  public getNotesCategories(): void {
    this.notesCategoryService.getAllNotesCategories().pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  private cleanup(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
    this.filterValue = '';
    this.isSearch = false;
    this.filterMode = false;
    this.notes = [];
    this.categories = [];
  }

  public onSearch(value: string): void {
    this.filterValue = value;
    if (this.filterMode) {
      this.search$.next(this.filterValue);
    }
    else if (this.filterValue) {
      this.search$.next(this.filterValue);
    } else {
      this.isSearch = false;
      this.notes = [];
    }
  }

  public onCancel(value: string): void {
    this.searchInput.nativeElement.focus();
    this.onSearch(value);
  }

  public onTap(note: Note): void {
    this.router.navigate(["/notes/save"], { queryParams: { id: note.id } });
  }

  public selectCategory(category: NoteCategory): void {
    this.filterMode = true;
    this.filter = { id: category.id, type: NoteSearchFilter.CATEGORY };
    this.search$.next("");
  }

  public selectColor(background: string | null): void {
    this.filterMode = true;
    this.filter = { id: background, type: NoteSearchFilter.BACKGROUND };
    this.search$.next("");
  }

}
