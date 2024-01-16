import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { AlertButton, IonRouterOutlet, IonTextarea, Platform, ViewDidEnter } from "@ionic/angular/standalone";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { NOTES_SAVE_DEPS } from "./notes-save.dependencies";
import { Note, NoteForm } from "../../interfaces/note.interface";
import { NotesCategoryService } from "../../services/notes-category.service";
import { NotesService } from "../../services/notes.service";

@Component({
  templateUrl: "./notes-save.component.html",
  styleUrls: ["./notes-save.component.scss"],
  standalone: true,
  imports: [NOTES_SAVE_DEPS]
})
export class NotesSaveComponent implements OnInit, OnDestroy, ViewDidEnter {
  public form!: FormGroup;
  private isDirty = false;
  @Input() id!: number;
  public date: string;
  public locale: string;
  public timezone: string;
  @ViewChild("textArea") textArea!: IonTextarea;
  public deleteAlertBtns!: AlertButton[];
  private backButtonSubscription!: Subscription;

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private translateService: TranslateService,
    private ionRouterOutlet: IonRouterOutlet,
    private platform: Platform) {
    this.date = new Date().toISOString();
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
    this.checkIfDirty();
    if (this.id) {
      this.getNoteById(this.id);
    }
    this.createDeleteAlertBtns();
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.ionRouterOutlet.pop();
    });
  }

  private initForm(): void {
    this.form = new FormGroup<NoteForm>({
      title: new FormControl(),
      value: new FormControl()
    });
  }

  private updateForm(note: Note): void {
    this.date = note.lastModifiedDate;
    this.form.patchValue(note, { emitEvent: false });
  }

  public saveNote(): void {
    let note: Note = this.form.value;
    note.categoryId = this.notesCategoryService.selectedCategory$.value;
    if (this.checkEmptyNote()) return;
    if (this.id) {
      if (this.isDirty) {
        this.update(note);
      }
    } else {
      this.insert(note);
    }
  }

  public checkEmptyNote(): boolean {
    return this.form.value.value ? false : true;
  }

  private checkIfDirty(): void {
    this.form.valueChanges.subscribe(() => this.isDirty = true);
  }

  private insert(note: Note): void {
    note.creationDate = new Date().toISOString();
    note.lastModifiedDate = new Date().toISOString();
    this.notesService.addNote(note).subscribe((id) => this.id = id);
  }

  private update(note: Note): void {
    note.lastModifiedDate = new Date().toISOString();
    this.notesService.updateNote(this.id, note).subscribe();
  }

  private getNoteById(id: number): void {
    this.notesService.getNoteById(id).subscribe(note => this.updateForm(note as Note));
  }

  private delete(): void {
    this.notesService.delete([this.id]).subscribe(() => this.ionRouterOutlet.pop());
  }

  private createDeleteAlertBtns(): void {
    const cancelText = this.translateService.instant("cancel");
    const deleteText = this.translateService.instant("delete");
    this.deleteAlertBtns = [
      {
        text: cancelText,
        role: 'cancel',
      },
      {
        text: deleteText,
        role: 'confirm',
        handler: () => this.delete()
      },
    ];
  }

}
