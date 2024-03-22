import { SortDirection, SortMode, ViewMode } from '../app/interfaces/note.interface';

export const environment = {
  production: true,
  viewMode: ViewMode.GRID,
  sortMode: SortMode.MODIFIED_DATE,
  sortDirection: SortDirection.ASCENDING,
  masonryOptions: {
    gutter: 20,
    horizontalOrder: true,
    originLeft: true,
    animations: {},
    resize: false
  }
};
