import { Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { LocalNotifications } from "@capacitor/local-notifications";
import { CanShareResult, Share } from "@capacitor/share";
import { AlertButton, IonRouterOutlet, Platform, ViewDidEnter } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Editor, toDoc, toHTML } from "ngx-editor";
import { Subject, Subscription, debounceTime, from, of, switchMap, takeUntil } from "rxjs";

import { convertValue } from "../../../../../app/utils/reminder-utils";
import { environment } from "../../../../../environments/environment";
import { Note, NoteForm, NotificationEvent } from "../../../../interfaces/note.interface";
import { NotesCategoryService } from "../../../../services/notes-category.service";
import { NotesService } from "../../../../services/notes.service";
import { NOTES_SAVE_DEPS } from "./notes-save.dependencies";

@Component({
  templateUrl: "./notes-save.component.html",
  styleUrl: "./notes-save.component.scss",
  standalone: true,
  imports: [NOTES_SAVE_DEPS]
})
export class NotesSaveComponent implements OnInit, OnDestroy, ViewDidEnter {
  @Input() public id!: number;
  @Input() public creationDate!: string;
  public note: Note = {} as Note;
  public locale: string;
  public timezone: string;
  @HostBinding('style.background') get background() { return this.note.background ? this.note.background : 'var(--ion-color-light)' }
  private isTemporary = false;
  public isColorPickerOpen = false;
  public isReminderOpen = false;
  public isToastOpen = false;
  public toastMessage = "";
  public isDeleteAlertOpen = false;
  public isMoveModalOpen = false;
  public toastDuration = environment.toastDuration;
  public deleteAlertBtns!: AlertButton[];
  public editor = new Editor();
  public form!: FormGroup;
  public isEditorFocus = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private translateService: TranslateService,
    private ionRouterOutlet: IonRouterOutlet,
    private platform: Platform) {
    this.locale = translateService.currentLang;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  ionViewDidEnter(): void {
    if (this.isTemporary) {
      this.editor.view.focus();
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.createDeleteAlertBtns();
    this.onNotesUpdate();
    if (this.id) {
      this.findById(this.id);
    } else {
      this.insertEmpty();
    }
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
      title: new FormControl(null),
      value: new FormControl(null)
    });
  }

  private findById(id: number): void {
    this.notesService.findById(id).subscribe(note => {
      this.note = note as Note;
      this.updateForm(this.note);
    });
  }

  public archive(archived: boolean): void {
    const eventType = archived ? NotificationEvent.ARCHIVE : NotificationEvent.UNARCHIVE;
    this.notesService.archive([this.id], archived)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.notesService.toastNotification$.next({ ids: [this.id], event: eventType });
        if (archived)
          this.ionRouterOutlet.pop();
      });
  }

  public delete(deleted: boolean): void {
    const eventType = deleted ? NotificationEvent.DELETE : NotificationEvent.UNDELETE;
    this.notesService.delete([this.id], deleted)
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.notesService.toastNotification$.next({ ids: [this.id], event: eventType });
        if (deleted)
          this.ionRouterOutlet.pop();
      });
  }

  private deleteForever(): void {
    this.notesService.deleteForever([this.id])
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.ionRouterOutlet.pop());
  }

  private onNotesUpdate(): void {
    this.notesService.notesUpdated$
      .pipe(takeUntil(this.destroy$)).subscribe((noteChange) => {
        if (noteChange.changes) {
          for (const [key, value] of Object.entries(noteChange.changes)) {
            Object.assign(this.note, { [key]: value });
          }
        }
      });
  }

  private onFormChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(250)).subscribe(() => this.update());
  }

  public pin(): void {
    const pinned = this.note.pinned > 0 ? false : true;
    this.notesService.pin([this.id], pinned).pipe(takeUntil(this.destroy$)).subscribe();
  }

  private updateForm(note: Note): void {
    this.form.patchValue({ title: note.title, value: toDoc(note.value) });
    this.onFormChanges();
  }

  public update(): void {
    const value = this.form.value.value ? toHTML(this.form.value.value) : '';
    this.notesService.update(this.id, this.form.value.title, value)
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

  public back(): void {
    if (this.id && this.isTemporary && this.isEmpty(this.form.value.value)) {
      this.notesService.deleteForever([this.id]).pipe(takeUntil(this.destroy$)).subscribe();
    }
    this.ionRouterOutlet.pop();
  }

  private insertEmpty(): void {
    const creationDate = this.creationDate ? this.creationDate : new Date().toISOString();
    const categoryId: number | undefined = this.notesCategoryService.selectedCategory$.value;
    this.notesService.insert(creationDate, categoryId)
      .pipe(takeUntil(this.destroy$), switchMap(id => {
        return this.notesService.findById(id);
      })).subscribe((note) => {
        note = note as Note;
        this.id = note.id;
        this.note = note;
        this.isTemporary = true;
      });
    this.onFormChanges();
  }

  public checkReminder(): void {
    from(LocalNotifications.requestPermissions()).pipe(takeUntil(this.destroy$)).subscribe((status) => {
      if (status.display === 'denied') {
        this.toastMessage = this.translateService.instant('allowNotifications');
        this.isToastOpen = true;
      } else {
        this.isReminderOpen = true;
      }
    });
  }

  private createDeleteAlertBtns(): void {
    this.deleteAlertBtns = [
      {
        text: this.translateService.instant("cancel"),
        role: 'cancel',
      },
      {
        text: this.translateService.instant("delete"),
        role: 'confirm',
        handler: () => this.deleteForever()
      },
    ];
  }

  public keepFocus(event: any) {
    event.preventDefault();
  }

  private isEmpty(value: { content: [{ content?: [] }] } | null): boolean {
    if (value && value.content.length > 0) {
      var firstContent = value.content[0];
      if (firstContent.content)
        return false;
    }
    return true;
  }

  public share(): void {
    const value = this.form.value.value ? toHTML(this.form.value.value) : '';
    from(Share.canShare())
      .pipe(takeUntil(this.destroy$), switchMap((shareResult: CanShareResult) => {
        if (shareResult.value) {
          return Share.share({
            title: this.form.value.title,
            text: convertValue(value),
          });
        }
        else {
          this.toastMessage = this.translateService.instant("sharingNotSupported");
          this.isToastOpen = true;
          return of()
        }
      })).subscribe();
  }

}
