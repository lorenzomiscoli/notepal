import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";

import { NOTES_LIST_HEADER_DEPS } from "./notes-list-header.dependencies";
import { NoteSetting } from './../../interfaces/note.interface';
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
  public viewMode = environment.viewMode;
  public sortMode = environment.sortMode;
  public isSortModalOpen = false;
  @ViewChild(IonModal) sortModal!: IonModal;
  public viewModeType: typeof ViewMode = ViewMode;
  public sortModeType: typeof SortMode = SortMode;
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
    this.saveNoteSetting();
  }

  public changeSort(event: CustomEvent): void {
    this.sortMode = event.detail.value;
    this.sortModal.dismiss();
    this.saveNoteSetting();
  }

  public updateData(noteSetting: NoteSetting): void {
    this.viewMode = noteSetting.viewMode;
    this.sortMode = noteSetting.sortMode;
  }

  public isGridView(): boolean {
    return this.viewMode === ViewMode.GRID ? true : false;
  }

  public getSettings(): void {
    this.notesSettingService.getNoteSetting().pipe(takeUntil(this.destroy$))
      .subscribe((noteSetting) => this.updateData(noteSetting));
  }

  public saveNoteSetting(): void {
    this.notesSettingService.addNoteSetting(this.viewMode, this.sortMode)
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

}
