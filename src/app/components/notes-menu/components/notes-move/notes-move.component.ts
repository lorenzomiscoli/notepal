import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";

import { IonModal } from "@ionic/angular/standalone";
import { Observable, Subject, takeUntil, tap } from "rxjs";

import { Note, NoteCategory } from "../../../../interfaces/note.interface";
import { NotesCategoryService } from "../../../../services/notes-category.service";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_MOVE_DEPS } from "./notes-move.dependencies";

@Component({
  selector: "app-notes-move",
  templateUrl: "./notes-move.component.html",
  styleUrl: "./notes-move.component.scss",
  standalone: true,
  imports: [NOTES_MOVE_DEPS]
})
export class NotesMoveComponent implements OnInit, OnDestroy {
  @Input() public isOpen = false;
  @Input({ required: true }) public selectedNotes!: Note[];
  @Output() public dismiss = new EventEmitter<void>();
  @ViewChild(IonModal) moveModal!: IonModal;
  public categories$!: Observable<NoteCategory[]>
  public defaultValue: number | undefined;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private notesService: NotesService, private notesCategoryService: NotesCategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.notesCategoryService.findAll().pipe(tap(() => {
      const uniqueCategories = this.selectedNotes.map(note => note.categoryId).filter((elem, index, self) => index === self.indexOf(elem));
      if (uniqueCategories.length === 1) {
        this.defaultValue = uniqueCategories[0] ? uniqueCategories[0] : 0;
      } else {
        this.defaultValue = undefined;
      }
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public updateCategory(event: CustomEvent): void {
    const targetId: number = event.detail.value === 0 ? null : event.detail.value;
    const ids = this.selectedNotes.map(category => category.id);
    this.notesService.updateCategory(ids, targetId).pipe(takeUntil(this.destroy$)).subscribe();
    this.moveModal.dismiss();
  }

  public onDismiss(): void {
    this.dismiss.emit();
  }

}
