import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { formatDate } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { AlertButton, IonTextarea, ViewDidEnter } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";

import { NOTES_ADD_DEPS } from "./notes-add.dependencies";
import { Note, NoteForm } from "../../interfaces/note.interface";
import { NotesService } from "../../services/notes.service";

@Component({
  templateUrl: "./notes-add.component.html",
  styleUrls: ["./notes-add.component.scss"],
  standalone: true,
  imports: [NOTES_ADD_DEPS]
})
export class NotesAddComponent implements OnInit, ViewDidEnter {
  public form!: FormGroup;
  private isDirty = false;
  @Input() id!: number;
  public date: string;
  @ViewChild("textArea") textArea!: IonTextarea;
  public deleteAlertBtns!: AlertButton[];

  constructor(private notesService: NotesService, private translateService: TranslateService, private router: Router) {
    this.date = this.parseDate();
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
  }

  private initForm(): void {
    this.form = new FormGroup<NoteForm>({
      title: new FormControl(),
      value: new FormControl()
    });
  }

  private updateForm(note: Note): void {
    this.date = this.parseDate(note.date);
    this.form.patchValue(note, { emitEvent: false });
  }

  public saveNote(): void {
    let note: Note = this.form.value;
    note.date = new Date().toISOString();
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
    this.notesService.addNote(note).subscribe((id) => this.id = id);
  }

  private update(note: Note): void {
    this.notesService.updateNote(this.id, note).subscribe();
  }

  private getNoteById(id: number): void {
    this.notesService.getNoteById(id).subscribe(note => this.updateForm(note as Note));
  }

  private delete(): void {
    this.notesService.delete([this.id]).subscribe(() => this.router.navigate(["/"]));
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

  private parseDate(date = new Date().toISOString()): string {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const format = this.translateService.instant("dateFormat");
    const locale = this.translateService.getDefaultLang();
    return formatDate(date, format, locale, timezone);
  }

}
