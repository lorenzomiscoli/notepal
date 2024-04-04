import { Component, OnDestroy, OnInit } from "@angular/core";

import { AlertButton, AlertInput, Platform } from "@ionic/angular";
import { NavController, ToastController } from "@ionic/angular/standalone";
import { Subject, Subscription, finalize, from, map, switchMap, takeUntil } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { NOTES_CATEGORIES_DEPS } from "./notes-categories.dependencies";
import { NoteCategory } from "../../../../interfaces/note.interface";
import { NotesCategoryService } from "../../../../services/notes-category.service";
import { NotesService } from "../../../../services/notes.service";

@Component({
  templateUrl: "./notes-categories.component.html",
  styleUrls: ["./notes-categories.component.scss"],
  standalone: true,
  imports: [NOTES_CATEGORIES_DEPS]
})
export class NotesCategories implements OnInit, OnDestroy {
  public categories: NoteCategory[] = [];
  public totalNotes: number = 0;
  public selectedMode = false;
  public isInsertAlertOpen = false;
  public alertButtons: AlertButton[] = [];
  public alertInputs: AlertInput[] = [];
  public isLoading = false;
  private backButtonSubscription!: Subscription;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private translateService: TranslateService,
    private platform: Platform,
    private toastController: ToastController,
    private navController: NavController) { }

  ngOnInit(): void {
    this.createAlertContent();
    this.getAllCategories();
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private getAllCategories(): void {
    this.isLoading = true;
    this.notesService.count().pipe(takeUntil(this.destroy$), switchMap(notesCount => {
      this.totalNotes = notesCount.totalNotes;
      return this.notesCategoryService.getAllNotesCategories();
    }), map(categories => this.mapCategories(categories)), finalize(() => this.isLoading = false))
      .subscribe((categories) => this.categories = categories);
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      else {
        this.navController.pop();
      }
    });
  }

  private mapCategories(categories: NoteCategory[]): NoteCategory[] {
    const selected = categories.some(category => {
      if (category.id === this.notesCategoryService.selectedCategory$.value) {
        category.isDefault = true;
        return true;
      } else {
        return false;
      }
    })
    categories.unshift({ name: this.translateService.instant("all"), isDefault: !selected, isSystem: true } as NoteCategory);
    return categories;
  }

  public onTap(category: NoteCategory): void {
    if (this.selectedMode) {
      if (category.isSystem) return;
      if (category.isSelected) {
        category.isSelected = false;
      }
      else {
        category.isSelected = true;
      }
    } else {
      if (category.isDefault) return;
      this.categories.find(category => {
        if (category.isDefault) {
          category.isDefault = false;
          return true;
        } else {
          return false;
        }
      })
      category.isDefault = true;
      this.notesCategoryService.selectedCategory$.next(category.id);
      this.navController.pop();
    }
  }

  public onPress(noteCategory: NoteCategory): void {
    if (noteCategory.isSystem) return;
    if (this.selectedMode) {
      if (noteCategory.isSelected) {
        noteCategory.isSelected = false;
      } else {
        noteCategory.isSelected = true;
      }
    } else {
      noteCategory.isSelected = true;
      this.selectedMode = true;
    }
  }

  public deselectAll(): void {
    this.selectedMode = false;
    this.categories.forEach(category => {
      if (!category.isSystem) category.isSelected = false
    });
  }

  private createAlertContent(): void {
    const cancelText = this.translateService.instant("cancel");
    const insertText = this.translateService.instant("insert");
    const categoryNameText = this.translateService.instant("categoryName");
    this.alertButtons = [{
      text: cancelText,
      role: 'cancel',
    },
    {
      text: insertText,
      role: 'confirm',
      handler: (value) => this.insertCategory(value)
    }];
    this.alertInputs = [
      {
        type: "text",
        name: "nameInsert",
        id: 'nameInsert',
        placeholder: categoryNameText
      }
    ]
  }

  private insertCategory(value: { nameInsert: string }): boolean | void {
    if (!value.nameInsert) {
      this.showError(this.translateService.instant("categoryCannotBeEmpty"));
      return false;
    }
    this.notesCategoryService.existsCategoryByName(value.nameInsert).pipe(takeUntil(this.destroy$), switchMap(isPresent => {
      if (isPresent) {
        throw { isPresent: true };
      } else {
        return this.notesCategoryService.addNoteCategory(value.nameInsert);
      }
    })).subscribe(({
      next: (id) => {
        this.categories.push({ id: id, name: value.nameInsert, notesCount: 0, isSelected: false });
      },
      error: (err) => {
        if (err.isPresent) {
          this.showError(this.translateService.instant("categoryAlreadyExists"));
        }
      }
    }));
  }

  public openInsertAlert(): void {
    let input: HTMLInputElement | null = document.querySelector("#nameInsert");
    if (input) {
      input.value = "";
      input.dispatchEvent(new KeyboardEvent('input')); // Emit event to notify alert there's been a change
    }
    this.isInsertAlertOpen = true;
  }

  public focusAlertInput(): void {
    let input: HTMLElement | null = document.querySelector(`#nameInsert`);
    if (input) input!.focus();
  }

  public showError(message: string): void {
    from(this.toastController.create({
      message: message,
      duration: 2000,
      position: "bottom",
    })).pipe(takeUntil(this.destroy$)).subscribe((value) => value.present());
  }

}

