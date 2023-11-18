import { FormControl } from "@angular/forms";

export interface Note {
  id: number,
  title: string;
  value: string;
  date: string;
}

export interface NoteForm {
  title: FormControl<string | null>;
  value: FormControl<string | null>;
}
