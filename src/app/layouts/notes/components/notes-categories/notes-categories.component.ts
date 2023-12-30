import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { Subject, finalize, from, map, of, switchMap, take, takeUntil } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { AlertButton, AlertInput, Platform } from "@ionic/angular";

import { NOTES_CATEGORIES_DEPS } from "./notes-categories.dependencies";
import { NoteCategory } from "../../interfaces/note.interface";
import { NotesCategoryService } from "../../services/notes-category.service";
import { NotesService } from "../../services/notes.service";
import { Toast } from "@capacitor/toast";
import { ToastController } from "@ionic/angular/standalone";

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
  public isUpdateAlertOpen = false;
  public isDeleteAlertOpen = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public alertButtons: AlertButton[] = [];
  public alertInputs: AlertInput[] = [];
  public alertUpdateButtons: AlertButton[] = [];
  public alertUpdateInputs: AlertInput[] = [];
  public alertDeleteButtons: AlertButton[] = [];
  public isAlreadyExistsToastOpen = false;
  public isLoading = false;
  public toastTranslations!: { categoryAlreadyExists: string, categoryCannotBeEmpty: string };

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private translateService: TranslateService,
    private platform: Platform,
    private toastController: ToastController) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.handleBackButton();
    this.createAlertContent();
    this.createUpdateAlertContent();
    this.createDeleteAlertContent();
    this.createToastTranslations();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getAllCategories(): void {
    this.isLoading = true;
    this.notesService.countNotes().pipe(takeUntil(this.destroy$), switchMap(notesCount => {
      this.totalNotes = notesCount.totalNotes;
      return this.notesCategoryService.getAllNotesCategories();
    }), map(categories => this.mapCategories(categories)), finalize(() => this.isLoading = false))
      .subscribe((categories) => this.categories = categories);
  }

  private handleBackButton(): void {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.selectedMode) {
        this.deselectAll();
      }
      else {
        processNextHandler();
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

  public getSelectedCategories(): NoteCategory[] {
    return this.categories.filter(category => category.isSelected);
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
      this.router.navigate(["notes"])
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
    this.categories.forEach(category => this.changeSelection(category, false));
  }

  public toggleSelect(): void {
    const selectedCategories = this.categories.filter(category => category.isSelected === true && !category.isSystem).length;
    const categories = this.categories.filter(category => !category.isSystem);
    if (selectedCategories === categories.length) {
      this.categories.forEach(category => this.changeSelection(category, false));
    } else {
      this.categories.forEach(category => this.changeSelection(category, true));
    }
  }

  private changeSelection(category: NoteCategory, isSelected: boolean): void {
    if (!category.isSystem) {
      category.isSelected = isSelected;
    }
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
      handler: (value) => this.saveCategory(value)
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

  private createUpdateAlertContent(): void {
    const cancelText = this.translateService.instant("cancel");
    const updateText = this.translateService.instant("update");
    const categoryNameText = this.translateService.instant("categoryName");
    this.alertUpdateButtons = [{
      text: cancelText,
      role: 'cancel',
    },
    {
      text: updateText,
      role: 'confirm',
      handler: (value) => this.updateCategory(value)
    }];
    this.alertUpdateInputs = [
      {
        type: "text",
        name: "nameUpdate",
        id: 'nameUpdate',
        placeholder: categoryNameText
      }
    ]
  }

  private createDeleteAlertContent(): void {
    const cancelText = this.translateService.instant("cancel");
    const deleteText = this.translateService.instant("delete");
    this.alertDeleteButtons = [
      {
        text: cancelText,
        role: 'cancel',
      },
      {
        cssClass: "cancel-btn",
        text: deleteText,
        role: 'confirm',
        handler: () => this.deleteCategory()
      },
    ];
  }

  private createToastTranslations(): void {
    this.toastTranslations = {
      categoryAlreadyExists: this.translateService.instant("categoryAlreadyExists"),
      categoryCannotBeEmpty: this.translateService.instant("categoryCannotBeEmpty")
    }
  }

  private saveCategory(value: { nameInsert: string }): boolean | void {
    if (!value.nameInsert) {
      this.showError(this.toastTranslations.categoryCannotBeEmpty);
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
          this.showError(this.toastTranslations.categoryAlreadyExists);
        }
      }
    }));

  }

  private updateCategory(value: { nameUpdate: string }): boolean | void {
    if (!value.nameUpdate) {
      this.showError(this.toastTranslations.categoryCannotBeEmpty);
      return false;
    }
    const id = this.getSelectedCategories()[0].id;
    this.notesCategoryService.existsCategoryByIdAndName(id, value.nameUpdate).pipe(takeUntil(this.destroy$), switchMap(isPresent => {
      if (isPresent) {
        throw { isPresent: true };
      } else {
        return this.notesCategoryService.updateNoteCategory(id, value.nameUpdate)
      }
    })).subscribe({
      next: () => {
        this.getSelectedCategories()[0].name = value.nameUpdate;
      },
      error: (err) => {
        if (err.isPresent) {
          this.showError(this.toastTranslations.categoryAlreadyExists);
        }
      }
    });
  }

  private deleteCategory(): void {
    let ids = this.getSelectedCategories().map(category => category.id);
    this.notesCategoryService.deleteCategories(ids).subscribe(() => {
      if (this.getSelectedCategories().some(category => category.isDefault)) {
        let systemCategory = this.categories[0];
        systemCategory.isDefault = true;
        this.notesCategoryService.selectedCategory$.next(systemCategory.id);
      }
      this.categories = this.categories.filter(category => !ids.includes(category.id));
    });
  }

  public openInsertAlert(): void {
    let input: HTMLInputElement | null = document.querySelector("#nameInsert");
    if (input) input.value = "";
    this.isInsertAlertOpen = true;
  }

  public openUpdateAlert(): void {
    let input: HTMLInputElement | null = document.querySelector("#nameUpdate");
    if (input) {
      input.value = this.getSelectedCategories()[0].name;
      input.dispatchEvent(new KeyboardEvent('input')); // Emit event to notify alert there's been a change
    }
    this.isUpdateAlertOpen = true;
  }

  public focusAlertInput(elementId: string): void {
    let input: HTMLElement | null = document.querySelector(`#${elementId}`);
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

