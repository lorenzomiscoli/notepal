import { FormControl } from "@angular/forms";

export interface Note {
  id: number,
  title: string;
  value: string;
  date: string;
  isSelected?: boolean;
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
