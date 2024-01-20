import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";

import { Color, Note } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";
import { NOTES_COLOR_PICKER_DEPS } from "./notes-color-picker.dependencies";

@Component({
  selector: "app-notes-color-picker",
  templateUrl: "./notes-color-picker.component.html",
  styleUrls: ["./notes-color-picker.component.scss"],
  standalone: true,
  imports: [NOTES_COLOR_PICKER_DEPS]
})
export class NotesColorPicker implements OnDestroy {
  @Input() public isOpen = false;
  @Input({ required: true }) public selectedNotes!: Note[];
  @Output() public close = new EventEmitter<void>();
  @ViewChild(IonModal) colorPickerModal!: IonModal;
  public colors: string[] = Object.values(Color);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onClose(): void {
    this.close.emit();
  }

  public isSelected(color: string | null): boolean {
    const colors = this.selectedNotes.map(note => note.color).filter((elem, index, self) => index === self.indexOf(elem));
    return colors.length === 1 && color === colors[0] ? true : false;
  }

  public changeColor(color: string | undefined): void {
    let ids: number[] = this.selectedNotes.map(note => note.id);
    this.notesService.changeNotesColor(ids, color as Color).pipe(takeUntil(this.destroy$)).subscribe();
    this.colorPickerModal.dismiss();
  }

}
