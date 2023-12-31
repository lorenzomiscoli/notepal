import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { AlertButton, AlertInput, ToastController } from "@ionic/angular/standalone";
import { Subject, from, switchMap, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { NOTES_CATEGORIES_SELECTED_HEADER_DEPS } from "./notes-categories-selected-header.dependencies";
import { NoteCategory } from "../../interfaces/note.interface";
import { NotesCategoryService } from './../../services/notes-category.service';

@Component({
  selector: "app-notes-categories-selected-header",
  templateUrl: "./notes-categories-selected-header.component.html",
  styleUrls: ["./notes-categories-selected-header.component.scss"],
  standalone: true,
  imports: [NOTES_CATEGORIES_SELECTED_HEADER_DEPS]
})
export class NotesCategoriesSelectedHeader implements OnInit, OnDestroy {
  @Input({ required: true }) public categories!: NoteCategory[];
  @Output() public close = new EventEmitter<void>();
  public isUpdateAlertOpen = false;
  public isDeleteAlertOpen = false;
  public alertUpdateButtons: AlertButton[] = [];
  public alertUpdateInputs: AlertInput[] = [];
  public alertDeleteButtons: AlertButton[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesCategoryService: NotesCategoryService,
    private translateService: TranslateService,
    private toastController: ToastController) { }

  ngOnInit(): void {
    this.createUpdateAlertContent();
    this.createDeleteAlertContent();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public deselectAll(): void {
    this.close.next();
  }

  public getSelectedCategories(): NoteCategory[] {
    return this.categories.filter(category => category.isSelected);
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

  public openUpdateAlert(): void {
    let input: HTMLInputElement | null = document.querySelector("#nameUpdate");
    if (input) {
      input.value = this.getSelectedCategories()[0].name;
      input.dispatchEvent(new KeyboardEvent('input')); // Emit event to notify alert there's been a change
    }
    this.isUpdateAlertOpen = true;
  }

  public focusAlertInput(): void {
    let input: HTMLElement | null = document.querySelector(`#nameUpdate`);
    if (input) input!.focus();
  }

  private updateCategory(value: { nameUpdate: string }): boolean | void {
    if (!value.nameUpdate) {
      this.showError(this.translateService.instant("categoryCannotBeEmpty"));
      return false;
    }
    const id = this.getSelectedCategories()[0].id;
    this.notesCategoryService.existsCategoryByIdNotAndName(id, value.nameUpdate).pipe(takeUntil(this.destroy$), switchMap(isPresent => {
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
          this.showError(this.translateService.instant("categoryAlreadyExists"));
        }
      }
    });
  }

  private deleteCategory(): void {
    let ids = this.getSelectedCategories().map(category => category.id);
    this.notesCategoryService.deleteCategories(ids).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.getSelectedCategories().some(category => category.isDefault)) {
        let systemCategory = this.categories[0];
        systemCategory.isDefault = true;
        this.notesCategoryService.selectedCategory$.next(systemCategory.id);
      }
      ids.forEach((id) => { this.categories.splice(this.categories.findIndex(category => category.id === id), 1); })
    });
  }

  public showError(message: string): void {
    from(this.toastController.create({
      message: message,
      duration: 2000,
      position: "bottom",
    })).pipe(takeUntil(this.destroy$)).subscribe((value) => value.present());
  }

}
