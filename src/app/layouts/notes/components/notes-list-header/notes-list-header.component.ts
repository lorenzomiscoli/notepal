import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";

import { NOTES_LIST_HEADER_DEPS } from "./notes-list-header.dependencies";
import { NoteSetting, SortDirection } from './../../interfaces/note.interface';
import { NotesSettingService } from "../../services/notes-setting.service";
import { SortMode, ViewMode } from "../../interfaces/note.interface";
import { environment } from './../../../../../environments/environment';

@Component({
  selector: "app-notes-list-header",
  templateUrl: "./notes-list-header.component.html",
  styleUrls: ["./notes-list-header.component.scss"],
  standalone: true,
  imports: [NOTES_LIST_HEADER_DEPS]
})
export class NotesListHeaderComponent implements OnInit, OnDestroy {
  @Output() viewChange = new EventEmitter<ViewMode>();
  @Output() sortChange = new EventEmitter<{ sortMode: SortMode, sortDirection: SortDirection }>();
  public viewMode = environment.viewMode;
  public sortMode = environment.sortMode;
  public sortDirection = environment.sortDirection;
  public isSortModalOpen = false;
  @ViewChild(IonModal) sortModal!: IonModal;
  public viewModeType: typeof ViewMode = ViewMode;
  public sortModeType: typeof SortMode = SortMode;
  public sortDirectionType: typeof SortDirection = SortDirection;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesSettingService: NotesSettingService) { }

  ngOnInit(): void {
    this.getSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public changeView(viewMode: ViewMode): void {
    this.viewMode = viewMode;
    this.viewChange.emit(this.viewMode);
    this.updateViewMode();
  }

  public changeSort(): void {
    this.sortChange.emit({ sortMode: this.sortMode, sortDirection: this.sortDirection });
    this.sortModal.dismiss();
    this.updateSort();
  }

  public updateData(noteSetting: NoteSetting): void {
    this.viewMode = noteSetting.viewMode;
    this.sortMode = noteSetting.sortMode;
    this.sortDirection = noteSetting.sortDirection;
  }

  public isGridView(): boolean {
    return this.viewMode === ViewMode.GRID ? true : false;
  }

  public getSettings(): void {
    this.notesSettingService.getNoteSetting().pipe(takeUntil(this.destroy$))
      .subscribe((noteSetting) => this.updateData(noteSetting));
  }

  private updateViewMode(): void {
    this.notesSettingService.updateViewMode(this.viewMode)
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

  private updateSort(): void {
    this.notesSettingService.updateSort(this.sortMode, this.sortDirection)
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

}
