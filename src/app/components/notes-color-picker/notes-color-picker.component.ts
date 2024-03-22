import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { Subject, takeUntil } from "rxjs";

import { Note, NoteBackground } from "../../interfaces/note.interface";
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
  public backgrounds: string[] = Object.values(NoteBackground);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onClose(): void {
    this.close.emit();
  }

  public isSelected(background: string | null): boolean {
    const backgrounds = this.selectedNotes.map(note => note.background).filter((elem, index, self) => index === self.indexOf(elem));
    return backgrounds.length === 1 && background === backgrounds[0] ? true : false;
  }

  public changeColor(background: string | undefined): void {
    let ids: number[] = this.selectedNotes.map(note => note.id);
    this.notesService.changeNotesBackground(ids, background as NoteBackground).pipe(takeUntil(this.destroy$)).subscribe();
    this.colorPickerModal.dismiss();
  }

}
