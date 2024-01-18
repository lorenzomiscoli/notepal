import { FormControl } from "@angular/forms";

export interface Note {
  id: number,
  title: string;
  value: string;
  creationDate: string;
  lastModifiedDate: string;
  pinned: number;
  categoryId: number | undefined;
  isSelected?: boolean;
}

export interface NoteSetting {
  id: number,
  viewMode: ViewMode;
  sortMode: SortMode;
}

export interface NoteCategory {
  id: number,
  name: string,
  notesCount?: number;
  isSelected?: boolean;
  isDefault?: boolean;
  isSystem?: boolean;
}

export interface NoteForm {
  title: FormControl<string | null>;
  value: FormControl<string | null>;
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list'
}

export enum SortMode {
  AZ = 'az',
  ZA = 'za',
  MODIFIED_DATE = 'modifiedDate'
}
