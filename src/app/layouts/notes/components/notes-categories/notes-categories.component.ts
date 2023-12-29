import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { Subject, map, switchMap, takeUntil } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { Platform } from "@ionic/angular";

import { NOTES_CATEGORIES_DEPS } from "./notes-categories.dependencies";
import { NoteCategory } from "../../interfaces/note.interface";
import { NotesCategoryService } from "../../services/notes-category.service";
import { NotesService } from "../../services/notes.service";

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
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private notesService: NotesService,
    private notesCategoryService: NotesCategoryService,
    private router: Router,
    private translateService: TranslateService,
    private platform: Platform) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.handleBackButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getAllCategories(): void {
    this.notesService.countNotes().pipe(switchMap(notesCount => {
      this.totalNotes = notesCount.totalNotes;
      return this.notesCategoryService.getAllNotesCategories();
    }), map(categories => this.mapCategories(categories))).subscribe((categories) => this.categories = categories);
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

}

