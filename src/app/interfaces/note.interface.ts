import { FormControl } from "@angular/forms";

export interface Note {
  id: number,
  title: string;
  value: string;
  creationDate: string;
  lastModifiedDate: string;
  pinned: number;
  background: string | undefined;
  categoryId: number | undefined;
  isSelected?: boolean;
}

export interface NoteSetting {
  id: number,
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: SortDirection;
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
  MODIFIED_DATE = 'modifiedDate',
  NAME = 'name'
}

export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending'
}

export enum NoteBackground {
  BLUSH = 'var(--color-blush)',
  APRICOT = 'var(--color-apricot)',
  NAVAJO_WHITE = 'var(--color-navajo-white)',
  KHAKI = 'var(--color-khaki)',
  AQUA_ISLAND = 'var(--color-aqua-island)',
  ICEBERG = 'var(--color-iceberg)',
  MOON_MIST = 'var(--color-moon-mist)',
  THISTLE = 'var(--color-thistle)',
  COSMOS = 'var(--color-cosmos)',
  SORRELL_BROWN = 'var(--color-sorrell-brown)',
  PEARL_BUSH = 'var(--color-pearl-bush)'
}

export enum NoteSearchFilter {
  CATEGORY, BACKGROUND
}
