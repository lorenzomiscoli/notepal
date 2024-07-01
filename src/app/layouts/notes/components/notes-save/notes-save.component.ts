import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { LocalNotifications } from "@capacitor/local-notifications";
import { AlertButton, IonRouterOutlet, Platform, ViewDidEnter } from "@ionic/angular/standalone";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Subscription, debounceTime, from, takeUntil } from "rxjs";

import { EditorService } from "../../../../../app/services/editor.service";
import { environment } from "../../../../../environments/environment";
import { Note, NotificationEvent } from "../../../../interfaces/note.interface";
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
  public valueChanges$ = new Subject<void>();
  public note: Note = {} as Note;
  public locale: string;
  public timezone: string;
  @ViewChild("textArea") public textArea!: ElementRef;
  @ViewChild("title", { read: ElementRef }) public title!: ElementRef;
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
  public isEditorFocus = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backButtonSubscription!: Subscription;

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private editorService: EditorService,
    private translateService: TranslateService,
    private ionRouterOutlet: IonRouterOutlet,
    private platform: Platform) {
    this.locale = translateService.currentLang;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  ionViewDidEnter(): void {
    if (this.isTemporary) {
      this.textArea.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.createDeleteAlertBtns();
    this.valueChanges$.pipe(takeUntil(this.destroy$), debounceTime(250)).subscribe(() => this.update())
    this.onNotesUpdate();
    this.onEditorChanges();
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

  private onEditorChanges(): void {
    this.editorService.newEditorContent$
      .pipe(takeUntil(this.destroy$)).subscribe((newContent) => this.handleNewContent(newContent));
  }

  public pin(): void {
    const pinned = this.note.pinned > 0 ? false : true;
    this.notesService.pin([this.id], pinned).pipe(takeUntil(this.destroy$)).subscribe();
  }

  private updateForm(note: Note): void {
    this.title.nativeElement.value = note.title;
    this.textArea.nativeElement.innerHTML = note.value;
  }

  public update(): void {
    this.notesService.update(this.id, this.title.nativeElement.value, this.textArea.nativeElement.innerHTML)
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

  public back(): void {
    if (this.id && this.isTemporary && !this.textArea.nativeElement.innerHTML) {
      this.notesService.deleteForever([this.id]).pipe(takeUntil(this.destroy$)).subscribe();
    }
    this.ionRouterOutlet.pop();
  }

  private insertEmpty(): void {
    const creationDate = this.creationDate ? this.creationDate : new Date().toISOString();
    const categoryId: number | undefined = this.notesCategoryService.selectedCategory$.value;
    this.notesService.insert(creationDate, categoryId)
      .pipe(takeUntil(this.destroy$)).subscribe((id) => {
        this.id = id;
        this.isTemporary = true;
      });
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

  public handleNewContent(content: Node): void {
    this.checkEmptyContent();
    var sel = window.getSelection();
    var range = sel!.getRangeAt(0).cloneRange();
    range.deleteContents();
    range.insertNode(content);
    range.setStartAfter(content);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
    this.update();
  }

  private checkEmptyContent(): void {
    let content = this.textArea.nativeElement.innerHTML;
    if (!content) {
      var sel = window.getSelection();
      var range = sel!.getRangeAt(0).cloneRange();
      var element = document.createElement("div");
      element.style.cssText = "display:none;"
      element.appendChild(document.createElement("br"));
      range.deleteContents();
      range.insertNode(element);
      range.setStartAfter(element);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

}
