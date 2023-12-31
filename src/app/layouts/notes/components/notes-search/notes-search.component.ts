import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ViewDidEnter, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { Subject, debounceTime, switchMap, takeUntil } from "rxjs";

import { NOTES_SEARCH_DEPS } from "./notes-search.dependencies";
import { Note, ViewMode } from "../../interfaces/note.interface";
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
  public filterValue = '';
  @ViewChild("searchInput") public searchInput!: ElementRef;
  public notes: Note[] = [];
  private search$ = new Subject<string>();
  public isSearch = false;
  public viewMode: ViewMode = environment.viewMode;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesSettingsService: NotesSettingService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ionViewWillEnter(): void {
    this.destroy$ = new Subject<boolean>();
    this.getNotesSettings();
    this.search();
  }

  ionViewWillLeave(): void {
    this.cleanup();
  }

  ionViewDidEnter(): void {
    this.searchInput.nativeElement.focus();
  }

  public search(): void {
    this.search$.pipe(takeUntil(this.destroy$), debounceTime(250), switchMap((value) => {
      return this.notesService.searchNotes(value);
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

  private cleanup(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.filterValue = '';
    this.isSearch = false;
    this.notes = [];
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
    this.router.navigate(["../save"], { relativeTo: this.route, queryParams: { id: note.id } });
  }

}
