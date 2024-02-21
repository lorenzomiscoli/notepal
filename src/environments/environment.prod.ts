import { SortMode, ViewMode } from './../app/layouts/notes/interfaces/note.interface';

export const environment = {
  production: true,
  viewMode: ViewMode.GRID,
  sortMode: SortMode.MODIFIED_DATE,
  masonryOptions: {
    gutter: 20,
    horizontalOrder: true,
    originLeft: true,
    animations: {},
    resize: false
  }
};
