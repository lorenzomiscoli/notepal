import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ViewDidEnter, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { Subject, Subscription, debounceTime, switchMap, takeUntil } from "rxjs";
import { TranslateService } from '@ngx-translate/core';

import { NOTES_SEARCH_DEPS } from "./notes-search.dependencies";
import { Note, NoteCategory, ViewMode } from "../../interfaces/note.interface";
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
  private filter!: { id: number, name: string, type: string };
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingsService: NotesSettingService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private translateService: TranslateService,
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

  public getSearchMessage(): string {
    if (this.filterMode) {
      return this.translateService.instant("searchIn") + " " + this.filter.name;
    } else {
      return this.translateService.instant("searchNotes");
    }
  }

  public search(): void {
    this.search$.pipe(takeUntil(this.destroy$), debounceTime(250), switchMap((value) => {
      if (this.filterMode) {
        return this.notesService.searchNotesByCategoryId(this.filter.id, value);
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
    if (this.filterValue) {
      this.search$.next(this.filterValue);
    } else {
      this.isSearch = false;
      this.notes = [];
    }
  }

  public onTap(note: Note): void {
    this.router.navigate(["/notes/save"], { queryParams: { id: note.id } });
  }

  public selectCategory(category: NoteCategory): void {
    this.filterMode = true;
    this.filter = { id: category.id, name: category.name, type: "category" };
    this.search$.next("");
  }

}
