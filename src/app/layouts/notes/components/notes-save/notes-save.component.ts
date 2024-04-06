import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { IonRouterOutlet, IonTextarea, Platform, ViewDidEnter } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Subscription, debounceTime, takeUntil } from "rxjs";

import { Note, NoteForm } from "../../../../interfaces/note.interface";
import { NotesCategoryService } from "../../../../services/notes-category.service";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_SAVE_DEPS } from "./notes-save.dependencies";

@Component({
  templateUrl: "./notes-save.component.html",
  styleUrls: ["./notes-save.component.scss"],
  standalone: true,
  imports: [NOTES_SAVE_DEPS]
})
export class NotesSaveComponent implements OnInit, OnDestroy, ViewDidEnter {
  @Input() public id!: number;
  @Input() public creationDate!: string;
  public note: Note = {} as Note;
  public form!: FormGroup;
  public locale: string;
  public timezone: string;
  @ViewChild("textArea") public textArea!: IonTextarea;
  private isTemporary = false;
  public isColorPickerOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private translateService: TranslateService,
    private ionRouterOutlet: IonRouterOutlet,
    private platform: Platform,
    private el: ElementRef) {
    this.locale = translateService.currentLang;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  ionViewDidEnter(): void {
    if (!this.id) {
      this.textArea.setFocus();
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.id) {
      this.findById(this.id);
    } else {
      this.insertEmpty();
    }
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.back();
    });
  }

  private initForm(): void {
    this.form = new FormGroup<NoteForm>({
      title: new FormControl(),
      value: new FormControl()
    });
    this.form.valueChanges.pipe(debounceTime(400)).subscribe(() => this.update());
  }

  private findById(id: number): void {
    this.notesService.findById(id).subscribe(note => {
      this.note = note as Note;
      this.el.nativeElement.style.background = note?.background;
      this.updateForm(this.note);
    });
  }

  public pin(): void {
    const pinned = this.note.pinned > 0 ? false : true;
    this.notesService.pin([this.id], pinned).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.note.pinned = pinned ? 1 : 0;
    });
  }

  private updateForm(note: Note): void {
    this.form.patchValue(note, { emitEvent: false });
  }

  public update(): void {
    const note: Note = this.form.value;
    note.lastModifiedDate = new Date().toISOString();
    this.notesService.update(this.id, note).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.note.value = note.value;
      this.note.title = note.title;
      this.note.lastModifiedDate = note.lastModifiedDate;
    });
  }

  public back(): void {
    if (this.id && this.isTemporary && !this.form.value.value) {
      this.notesService.deleteForever([this.id]).pipe(takeUntil(this.destroy$)).subscribe();
    }
    this.exit();
  }

  public exit(): void {
    this.ionRouterOutlet.pop();
  }

  private insertEmpty(): void {
    const creationDate = this.creationDate ? this.creationDate : new Date().toISOString();
    const categoryId: number | undefined = this.notesCategoryService.selectedCategory$.value;
    this.notesService.insert(creationDate, categoryId)
      .pipe(takeUntil(this.destroy$)).subscribe((id) => {
        this.id = id;
        this.isTemporary = true;
        this.note = { id: id, categoryId: categoryId, creationDate: creationDate, lastModifiedDate: creationDate } as Note;
      });
  }

  public onMoved(categoryId: number): void {
    this.note.categoryId = categoryId;
  }

  public onBackgroundChanged(background: string): void {
    this.note.background = background;
    this.el.nativeElement.style.background = background ? background : 'unset';
  }

}
