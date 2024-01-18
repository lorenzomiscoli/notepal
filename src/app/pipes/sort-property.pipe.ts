import { Pipe, PipeTransform } from "@angular/core";
import { Note, SortMode } from "../layouts/notes/interfaces/note.interface";

@Pipe({
  name: "appSortNotes",
  standalone: true
})
export class SortNotesPipe implements PipeTransform {

  transform(notes: Note[], sortMode: SortMode) {
    if (!notes) return notes;
    switch (sortMode) {
      case SortMode.AZ: {
        notes = notes.sort((a: Note, b: Note) => this.sortByName(a, b, true));
        break;
      };
      case SortMode.ZA: {
        notes = notes.sort((a: Note, b: Note) => this.sortByName(a, b, false));
        break;
      };
      case SortMode.MODIFIED_DATE: {
        notes = notes.sort((a: Note, b: Note) => this.sortByModifiedDate(a, b));
        break;
      };
    }
    notes = notes.sort((a: Note, b: Note) => this.sortByPinned(a, b));
    return notes;
  }

  private sortByPinned(a: Note, b: Note): number {
    return b.pinned - a.pinned;
  }

  private sortByName(a: Note, b: Note, isAscOrder: boolean): number {
    if (a.title === null)
      return 1;
    if (b.title === null)
      return -1;
    var nameA = a.title.toLowerCase();
    var nameB = b.title.toLowerCase();
    if (isAscOrder) {
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    }
    else {
      if (nameB < nameA)
        return -1;
      if (nameB > nameA)
        return 1;
      return 0;
    }
  }

  private sortByModifiedDate(a: Note, b: Note): number {
    return new Date(b.lastModifiedDate).getTime() - new Date(a.lastModifiedDate).getTime();
  }

}
