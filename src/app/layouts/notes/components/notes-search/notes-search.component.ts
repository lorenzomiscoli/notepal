import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ViewDidEnter, ViewDidLeave } from "@ionic/angular";
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
export class NotesSearchComponent implements OnInit, OnDestroy, ViewDidEnter, ViewDidLeave {
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

  ngOnInit(): void {
    this.search$.pipe(takeUntil(this.destroy$), debounceTime(250), switchMap((value) => {
      return this.notesService.searchNotes(value);
    })).subscribe((value) => {
      this.notes = value;
      this.isSearch = true
    })
    this.notesSettingsService.notesSettingsUpdated$.pipe(takeUntil(this.destroy$),
      switchMap(() => this.notesSettingsService.getNoteSetting())).subscribe((noteSetting) => {
        this.viewMode = noteSetting.viewMode;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ionViewDidEnter(): void {
    this.searchInput.nativeElement.focus();
  }

  ionViewDidLeave(): void {
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
